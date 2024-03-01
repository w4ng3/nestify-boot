/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { NotFoundException, Type } from '@nestjs/common'
import { CrudController } from './crud.controller'
import { isNil } from 'lodash'
import { ALLOW_GUEST, CRUD_INCLUDE, CRUD_OPTIONS, PERMISSION_KEY } from '@/config'
import { PermissionsEnum } from '@/config/enum.config'

/**
 * CURD控制器方法列表
 */
type CurdMethod =
  | 'create'
  | 'findOne'
  | 'findAll'
  | 'findPage'
  | 'update'
  | 'delete'
  | 'findPageOfDeleted'
  | 'restore'

/**
 * CRUD装饰器的方法选项
 */
interface CrudMethodOption {
  /**
   * 该方法是否允许匿名访问
   */
  allowGuest?: boolean
  /**
   * 该方法需要的特定权限
   */
  permission?: PermissionsEnum
}

/**
 * 每个启用方法的配置
 */
interface CurdItem {
  name: CurdMethod
  /**
   * @tips option里 allowGuest为true 时 不能配置 permission
   */
  option?: CrudMethodOption
}

/**
 * CRUD装饰器选项
 */
interface CurdOptions {
  // id?: string
  /** 需要启用的方法 */
  enabled: Array<CurdMethod | CurdItem>
  /** 一些方法要使用到的自定义DTO */
  dtos: {
    [key in 'query' | 'create' | 'update']?: Type<any>
  }
  /** 关联查询参数(用于 findOne、findAll、findPage、findPageOfDeleted 方法) */
  queryInclude?: object
}

/**
 * @description: CRUD装饰器
 * @param {CurdOptions} options {enabled、dtos、queryInclude}
 */
export const Crud =
  (options: CurdOptions) =>
  <T extends CrudController>(Target: Type<T>) => {
    // Target 是一个类，它继承自 CrudController，所以它的原型链上有 CrudController 的方法
    // 通过 Reflect.defineMetadata 方法将 options 保存到 Target 的元数据中, 以便后续使用
    Reflect.defineMetadata(CRUD_OPTIONS, options, Target)
    const { enabled, dtos, queryInclude } = Reflect.getMetadata(CRUD_OPTIONS, Target) as CurdOptions
    const changed: Array<CurdMethod> = []
    // 添加验证 DTO 类
    for (const value of enabled) {
      const { name } = typeof value === 'string' ? { name: value } : value
      if (changed.includes(name)) continue
      if (name in Target.prototype) {
        // getOwnPropertyDescriptor可以获取到属性的描述符,若子类重写了该方法，则获取到 method，否则获取到 undefined
        const method = Object.getOwnPropertyDescriptor(Target.prototype, name)
        if (isNil(method)) {
          // 获取该方法所有注入的服务,这里用于获取到 DTO 类 ，
          // 除了 design:paramtypes 还有 design:returntype, design:type, design:metadata
          const paramTypes = Reflect.getMetadata('design:paramtypes', Target.prototype, name)
          const params = [...paramTypes]
          //替换 DTO 类
          if (name === 'create') params[0] = dtos.create
          else if (name === 'update') params[1] = dtos.update
          else if (['findPage', 'findPageOfDeleted'].includes(name)) params[0] = dtos.query
          // 通过反射修重新定义参数类型
          Reflect.defineMetadata('design:paramtypes', params, Target.prototype, name)
          // 注入include 关联查询参数
          if (['findOne', 'findAll', 'findPage', 'findPageOfDeleted'].includes(name)) {
            Reflect.defineMetadata(CRUD_INCLUDE, queryInclude, Target.prototype, name)
          }
          // 存放
          changed.push(name)
        }
      }
    }

    /**
     * 是否允许匿名访问 & 是否需要特定权限
     * changed 是一个数组，里面存放的是启用的且未被重写的方法
     */
    for (const key of changed) {
      const find = enabled.find((v) => (typeof v === 'string' ? v === key : v.name === key))
      const option = typeof find === 'string' ? {} : find.option ?? {}
      if (option.allowGuest) {
        Reflect.defineMetadata(ALLOW_GUEST, true, Target.prototype, key)
      }
      if (option.permission) {
        Reflect.defineMetadata(PERMISSION_KEY, option.permission, Target.prototype, key)
      }
    }

    /**
     * 对于不启用的方法返回404
     */
    const fixedProperties = ['constructor', 'service'] // 需要被忽略的固定属性
    for (const key of Object.getOwnPropertyNames(CrudController.prototype)) {
      const isEnabled = options.enabled.find((v) =>
        typeof v === 'string' ? v === key : v.name === key,
      )
      // 如果不启用并且不是固定属性，则返回404，否则使用 CrudController 的方法
      if (!isEnabled && !fixedProperties.includes(key)) {
        // 既没有启用，且子类没有重写该方法（此时methid为undefined）
        const method = Object.getOwnPropertyDescriptor(Target.prototype, key)
        if (isNil(method)) {
          Object.defineProperty(Target.prototype, key, {
            // ...method,
            value: function () {
              throw new NotFoundException()
            },
          })
        }
      }
    }
    return Target
  }
