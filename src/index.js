/*
 * @Author: your name
 * @Date: 2020-03-16 18:38:40
 * @LastEditTime: 2020-05-16 18:17:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \labelmiddleplatform\src\index.js
 */
import dva from 'dva';
import '../node_modules/servyou-sj-fe/lib/svy-ant.less';
import './assets/css/antd-reset.less'
import './index.less';

// 1. Initialize
const app = dva({
    initialState: {
        // ]
    },
    onError(e, dispatch) {
        console.log('---------------程序出现错误----------------');
        console.log(e.message);
    }
});

// 2. Plugins
// app.use({});

// 3. Model
app.model(require('./models/app/app').default);
app.model(require('./models/customAnalysis/resultTable.js').default);
app.model(require('./models/customAnalysis/customFilterDropDown.js').default);
app.model(require('./models/customAnalysis/scSelect.js').default);
app.model(require('./models/customAnalysis/storeCondition.js').default);
app.model(require('./models/common/common.js').default);
app.model(require('./models/labelManagement/labelManagement.js').default);
app.model(require('./models/labelManagement/tagsDirectory.js').default);
app.model(require('./models/tagsDefined/tagsDefined.js').default);
app.model(require('./models/tagsDefined/tagsDefinedSQL.js').default);
app.model(require('./models/customAnalysis/conditions.js').default);
app.model(require('./models/processMonitoring/processMonitoring.js').default);
app.model(require('./models/customAnalysis/resultApplication.js').default);
app.model(require('./models/customAnalysis/taskMonitoring.js').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
