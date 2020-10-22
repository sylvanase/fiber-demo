import { createTaskQueue } from '../Misc'

const taskQueue = createTaskQueue()

/**
 * 要执行的子任务
 */
let subTask = null

let pendingCommit = null

// 调度任务
const performTask = deadline => {
	workLoop(deadline)
	/**
	 * 判断任务是否存在
	 * 判断任务队列中是否还有任务没有执行
	 * 再一次告诉浏览器在空闲的时间执行任务
	 */
	if (subTask || !taskQueue.isEmpty()) {
		requestIdleCallback(performTask)
	}
}

// 循环任务
const workLoop = deadline => {
	if (!subTask) {
		subTask = getFirstTask()
	}

	while (subTask && deadline.timeRemaining() > 1) {
		subTask = executeTask(subTask)
	}
}

// 获取任务
const getFirstTask = () => {}
// 执行任务
const executeTask = () => {}

export const render = (element, dom) => {
	/**
	 * 1. 向任务队列中添加任务
	 * 2. 指定在浏览器空闲时执行任务
	 */

	taskQueue.push({
		dom,
		props: {
			children: element,
		},
	})

	// console.log(taskQueue.pop())
	requesIdleCallback(performTask)

	/**
	 * 任务：通过 vdom 对象构建 fiber 对象
	 * 任务队列：数组，存储各种任务
	 */
}
