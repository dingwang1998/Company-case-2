import Mock from 'mockjs';


Mock.mock('/apo/user', {
    'name': '@cname',
    'intro': '@word(20)'
});