/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

export interface CityData {
  code: string
  level: number
  name: string
  areaList: any[]
}

export interface Window {
  cityData: CityData[]
}

/**
 * 商品详情
 */
export interface GoodDetails {
  [proptypeName: string]: any
  selected?: boolean
  inventory: number
  categories: any[];
  name: string;
  mainPictures: string[];
  desc: string;
  price: string;
  oldPrice: string;
  userAddresses: any[] | null;
  specs: any[];
  skus: any[];
  spuCode: string
  id: string
  commentCount: number
  details: {
    pictures: string[]
    properties: {
      name: string
      value: string
    }[]
  }
  collectCount: number
}
