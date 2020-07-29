import request from '../../utils/request';

//请求标签目录列表
export function whcx() {
	return request(`tagMl/whcx`);
}
//标签目录维护启用
export function mlQy(mldm = "") {
	return request(`tagMl/mlQy?mldm=${mldm}`);
}

//标签目录维护停用
export function mlTy(mldm = "") {
	return request(`tagMl/mlTy?mldm=${mldm}`);
}

//标签目录维护删除
export function mlSc(mldm = "") {
	return request(`tagMl/mlSc?mldm=${mldm}`);
}

//标签目录新增、修改
export function save(params = {
	sjbqmldm: "",
	mlmc: ""
}) {
	return request('tagMl/save', {
		headers: {
			'Content-Type': 'application/json',
		},
		method: 'POST',
		body: JSON.stringify(params),
	});
}