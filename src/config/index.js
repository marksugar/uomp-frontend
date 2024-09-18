/**
 * 环境配置文件
 * 开发环境
 * 测试环境
 * 线上环境
 */
// 当前的环境
const env = import.meta.env.MODE || 'prod'
const VITE_LocalMockOON="http://localhost:3000/"
const EnvConfig = {
  development: {
    baseApi: '/api',
    mockApi: VITE_LocalMockOON,
  },
  test: {
    baseApi: '//test.future.com/api',
    mockApi: VITE_LocalMockOON,
  },
  prod: {
    baseApi: '/api',
    mockApi: VITE_LocalMockOON,
  },
}

export default {
  env,
  // mock的总开关,
  mock: true,
  ...EnvConfig[env]
}

