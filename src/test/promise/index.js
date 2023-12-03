// getTopListBlog
// console.log(await getTopListBlog()) ||

const p1 = new Promise((resolve, reject) => setTimeout(resolve, 1000, 'promiseResolver 01'))
const p2 = new Promise((resolve, reject) => setTimeout(reject, 2000, 'promiseRejecter 02'))
const p3 = new Promise((resolve, reject) => setTimeout(resolve, 3000, 'promiseResolver 03'))

// Promise.all([p1, p2, p3]).then(values => console.log('result promise.all(values)'))
// Promise.any([p1, p2, p3]).then(value => console.log('result promise.any(value)'))

// Hoàn thiện code ở đây
// Sử dụng Promise.race để trả về giá trị của promise đầu tiên được giải quyết hoặc bị từ chối

// all là trả về tất cả, nhưng khi có err thì trả về reject err thì bỏ qua tất cả các resolve
// any là trả về tất cả thành công resolve đầu tiên, nếu tất cả đều bị lỗi thì nó sẽ trả về catch tất cả bị lỗi
// race là lấy cái nhanh nhất cho dù là thành công hay thất bại
// allSettled là lấy cả resolve và reject

// Promise.race([p1, p2, p3]).then(value => console.log('result promise.race(value)')).catch(error => console.error('error promise.race(error)'))
// Promise.allSettled([p1, p2, p3]).then(value => console.log('result promise.race(value)')).catch(error => console.error('error promise.race(error)'))
