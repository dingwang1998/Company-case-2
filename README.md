## 适用项目
采用react技术栈开发的不需要兼容IE8的新项目

## 目录结构
```
├── /mock/              # 数据mock的接口文件
├── /public/            # index.html和libs目录
├── /src/               # 项目源码目录
│ ├── /assets/          # 静态资源
│ ├── /components/      # 项目组件
│ ├── /models/          # 数据模型
│ ├── /routes/          # 路由组件（页面维度）
│ ├── /services/        # 数据接口
│ ├── /utils/           # 工具函数
│ ├── route.js          # 路由配置
│ ├── index.js          # 入口文件
│ └── index.css      
├── .editorconfig       # 编辑格式配置
├── .eslintrc           # eslint配置信息
├── .gitignore          # git版本忽略信息
├── .roadhogrc.mock.js  
├── .webpackrc          # webpack配置信息
├── package-lock.json   
├── package.json        # 项目信息
└── proxy.config.js     # 数据mock配置
```

## 如何新增组件
1. 在`/src/components/`目录下新建组件`Example.js`(规范起见：组件首字母要大写)  

```javascript
import React from 'react';
const Example = () => {
    return (
        <div>
        这是一个组件例子
        </div>
    );
};
Example.propTypes = {
};
export default Example;
```

## 如何新增页面
1. 在`/src/routes/`目录下新建页面`Example.js`(也是以组件的形式引用，故首字母要大写)  

```javascript
import React from 'react';
import { connect } from 'dva';
import ExampleConponent from '../components/Example'

function Example() {
  return (
    <div>
        <h1>这是一个页面例子</h1>
        <ExampleConponent />
    </div>
  );
}

Example.propTypes = {
};

export default connect()(Example);
```  

2. 在`/src/router.js`中注册路由

```
...
import Example from './routes/Example';
...
<Route path="/example" exact component={Example} />
...
```  

## 多calssname的解决方式
脚手架中已内置了classnames的第三方包
```  
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
// 可以在组件中写一个计算类名的方法来计算样式，（举例：当前类目选中还是没选中）
  _calcuClass4Catalog(catalog) {
    const props = this.props;
    return cx({
      catalogBlock: true,
      selectedBlock: props.currentCatalog === catalog
    });
  }
```


## 请求后台数据
使用内置的fetch  
1. 在`/src/services/`目录下定义一个`example.js`  

```
import request from '../utils/request';
  
// 默认get
export function query(payload) {
  return request('/api/users'+payload);
}
// post
export function save(payload) {
  param = JSON.stringify(payload);
  return request('/api/save',{
      headers: {
          'Content-Type': 'application/json'
      },
      method: 'POST',
      body: param
  });
}
```  

2. 在`src/models/`目录下定义一个`example.js`  

```
import * as Service from '../services/example'
export default {

  namespace: 'example',

  state: {},

  subscriptions: {
    setup({ dispatch, history }) {
    },
  },

  // generator函数进行后台请求
  effects: {
    // get请求
    *fetch({ payload }, { call, put }) {
      yield call(Service.query, payload);
    },
    // post请求
    *save({ payload },{ call }) {
      yield call(Service.save, payload);
    }
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};

```  

3. 任务的并行执行
    const [result1, result2]  = yield [
        call(service1, param1),
        call(service2, param2)
    ]  

4. 任务的竞争
   const { data, timeout } = yield race({
  data: call(service, 'some data'),
  timeout: call(delay, 1000)
});

if (data)
  put({type: 'DATA_RECEIVED', data});
else
  put({type: 'TIMEOUT_ERROR'});


## 错误处理
1. 全局错误处理hook  
```  
const app = dva({
    initialState: {

    },
    // 全局的错误处理，包括effects 里的抛错和 reject 的 promise 就都会被捕获到
    onError(e, dispatch) {
        console.log(e.message);
    },
});
```
2. 对某些effect错误进行特殊处理，通过在effect内部加入try catch
```
app.model({
  effects: {
    *addRemote() {
      try {
        // Your Code Here
      } catch(e) {
        console.log(e.message);
      }
    },
  },
});
```  

## Mock数据
1. 在`roadhogrc.mock.js`中进行配置  

```
export default {
    'GET /apo/user': { users: [1,2] }
};
```  

## 配置代理
修改根目录下`.webpackrc.js`中的`proxy`配置，修改请求路径，同时将`target`设置为项目的代理服务器地址  

```
"proxy": {
    "/api": {
        "target": "http://jsonplaceholder.typicode.com/",
        "changeOrigin": true,
        "pathRewrite": { "^/api" : "" }
    }   
}
```  

## 如何引入webpack的其他插件
项目根目录下新建一个webpack.config.js用来引入webpack的其他插件等等，config的配置都可以在这个文件里面写，写完直接return 这个config就可以
```  
module.exports = (config, { webpack }) => {
    // 虽然这么写全局注入成功了，但是在页面上引入jQuery的时候会报未定义的错误
    // config.plugins.push(
    //     // 全局暴露统一入口
    //     new webpack.ProvidePlugin({
    //         jQuery: 'jquery'
    //     }),
    // );
    // console.log(config);
    return config
} 
```

## 脚手架中用到的技术栈
* [dva](https://dvajs.com/)：一个基于 redux 和 redux-saga 的数据流方案，然后为了简化开发体验，dva 还额外内置了 react-router 和 fetch，所以也可以理解为一个轻量级的应用框架。
* [redux-saga](https://redux-saga-in-chinese.js.org/)：一个用于管理应用程序 Side Effect（副作用，例如异步获取数据，访问浏览器缓存等）的 library，它的目标是让副作用管理更容易，执行更高效，测试更简单，在处理故障时更容易。

## 代码规范及踩过的坑
1. components/中只放组件，包括pure组件或container组件，routes/中放和路由相关的组件，跟路由相关的组件一般都是容器组件；
2. 样式直接跟随组件在同一个文件夹下，与组件起一样的名字方面维护；
3. stateless组件中无法写生命周期函数，如果有用到生命周期函数的建议还是使用react的class Com extends React.component的写法；
4. 不要在自己的代码里去改变store里面的数据，例如this.props.arr.push(...);然后再去dispatch的时候不会重新渲染组件,实在要用的话先拷贝一份，例如let newArr = [...arr]，然后后面再去dispatch,...只针对于简单的对象或数组，有嵌套的话建议使用JSON.parse(JSON.stringfy(**))来深拷贝之后再用；
5. 全局注入js的方法，直接在页面上引入script标签，然后每次组件上要用的时候const mini = window.mini就可以用了，还可以减少打包完之后的js的体积;这些需要全局注入的js放在public/libs下面，然后页面引入这个libs下面的js，roadhog打包的时候脚手架会自动把public文件夹统一拷贝到dist下面，所以不用担心引用路径问题；
6. antd的表格表头和内容不对齐的问题，看看表格中是否有纯数字的内容列，没有换行所以导致表头和内容错位，建议给纯数字列设置最小宽度