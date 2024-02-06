/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { NotFoundException, Type } from '@nestjs/common'
import { CrudController } from './crud.controller'
import { isNil } from 'lodash'
import { ALLOW_GUEST } from '@/config'

/**
 * CURD控制器方法列表
 */
type CurdMethod = 'create' | 'findOne' | 'findAll' | 'findPage' | 'update' | 'delete' | 'restore'

/**
 * CRUD装饰器的方法选项
 */
interface CrudMethodOption {
  /**
   * 该方法是否允许匿名访问
   */
  allowGuest?: boolean
  /**
   * 序列化选项,如果为`noGroup`则不传参数，否则根据`id`+方法匹配来传参
   */
  // serialize?: ClassTransformOptions | 'noGroup';
}

/**
 * 每个启用方法的配置
 */
interface CurdItem {
  name: CurdMethod
  option?: CrudMethodOption
}

/**
 * CRUD装饰器选项
 */
interface CurdOptions {
  id: string
  // 需要启用的方法
  enabled: Array<CurdMethod | CurdItem>
  // 一些方法要使用到的自定义DTO
  dtos: {
    [key in 'query' | 'create' | 'update']?: Type<any>
  }
}

/**
 * @description: CRUD装饰器
 */
export const Crud =
  (options: CurdOptions) =>
  <T extends CrudController>(Target: Type<T>) => {
    // 为什么 Target 继承自 CrudController 时，它的原型链上没有 CrudController 的方法？
    // 因为在 CrudController 中定义的方法是实例方法，而不是原型方法
    // 通过 Object.getOwnPropertyNames 方法获取到的是实例属性，而不是原型属性
    // Target 是一个类，它继承自 CrudController，所以它的原型链上有 CrudController 的方法
    // 通过 Reflect.defineMetadata 方法将 options 保存到 Target 的元数据中, 以便后续使用
    // 读取方式是 Reflect.getMetadata('CRUD_OPTIONS', Target)
    Reflect.defineMetadata('CRUD_OPTIONS', options, Target)
    const { enabled, dtos } = Reflect.getMetadata('CRUD_OPTIONS', Target) as CurdOptions
    const changed: Array<CurdMethod> = []
    // 添加验证 DTO 类
    for (const value of enabled) {
      const { name } = typeof value === 'string' ? { name: value } : value
      if (changed.includes(name)) continue
      if (name in Target.prototype) {
        // getOwnPropertyDescriptor 可以获取到属性的描述符
        let method = Object.getOwnPropertyDescriptor(Target.prototype, name)
        if (isNil(method)) {
          method = Object.getOwnPropertyDescriptor(CrudController.prototype, name)
        }
        // 获取该方法所有注入的服务,这里用于获取到 DTO 类 ，
        // 除了 design:paramtypes 还有 design:returntype, design:type, design:metadata
        const paramTypes = Reflect.getMetadata('design:paramtypes', Target.prototype, name)
        const params = [...paramTypes]
        //替换 DTO 类
        if (name === 'create') params[0] = dtos.create
        else if (name === 'update') params[1] = dtos.update
        // else if (['list', 'page'].includes(name)) params[0] = dtos.query\
        // 通过反射修重新定义参数类型
        Reflect.defineMetadata('design:paramtypes', params, Target.prototype, name)
        changed.push(name)
      }
    }

    /**
     * 添加序列化选项以及是否允许匿名访问等metadata
     */
    for (const key of changed) {
      const find = enabled.find((v) => (typeof v === 'string' ? v === key : v.name === key))
      const option = typeof find === 'string' ? {} : find.option ?? {}
      // 添加序列化（VO？）
      // let serialize = {}
      // if (isNil(option.serialize)) {
      //   if (['list', 'page', 'create', 'update'].includes(key)) {
      //     serialize = { groups: [`${id}-datail`] }
      //   } else if(['findOne'].includes(key)) {
      //     serialize = { groups: [`${id}-list`] }
      //   }
      // } else if (option.serialize === 'noGroup') {
      //   serialize = {}
      // }
      // Reflect.defineMetadata('CLASS_SERIALIZER_OPTIONS', serialize, Target.prototype, key)
      if (option.allowGuest) {
        Reflect.defineMetadata(ALLOW_GUEST, true, Target.prototype, key)
      }
    }

    const fixedProperties = ['constructor', 'service']
    for (const key of Object.getOwnPropertyNames(CrudController.prototype)) {
      // 对于不启用的方法返回404
      const isEnabled = options.enabled.find((v) =>
        typeof v === 'string' ? v === key : v.name === key,
      )
      // 如果不启用并且不是固定属性，则返回404，否则使用 CrudController 的方法
      if (!isEnabled && !fixedProperties.includes(key)) {
        // const method = Object.getOwnPropertyDescriptor(CrudController.prototype, key)
        Object.defineProperty(Target.prototype, key, {
          // ...method,
          value: function () {
            throw new NotFoundException()
          },
        })
      }
    }
    return Target
  }
