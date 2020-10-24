import { createTaskQueue, arrified, createStateNode, getTag } from '../Misc'

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
	// 子任务不存在，获取子任务
	if (!subTask) {
		subTask = getFirstTask()
	}
	// 任务存在且浏览器有空余时间，调用 executeTask 执行任务
	while (subTask && deadline.timeRemaining() > 1) {
		subTask = executeTask(subTask)
	}
}

// 获取任务队列中的第一个子任务
const getFirstTask = () => {
	// 从任务队列中获取任务
	const task = taskQueue.pop()
	// 返回最外城节点的filber对象
	return {
		props: task.props,
		stateNode: root.stateNode,
		tag: 'host_root',
		effect: [],
		child: null,
	}
}

// 执行任务
const executeTask = fiber => {
	// 接收任务执行
	// 为每一个节点构建fiber对象
	reconcileChildren(fiber, fiber.props.children)

	/**
	 * 如果子级存在 返回子级
	 * 将这个子级当做父级 构建这个父级下的子级
	 */
	if (fiber.child) {
		return fiber.child
	}

	let currentExecutelyFiber = fiber

	while (currentExecutelyFiber.parent) {
		// 有同级返回同级
		if (currentExecutelyFiber.sibling) {
			return currentExecutelyFiber.sibling
		}
		// 没有同级返回父级
		currentExecutelyFiber = currentExecutelyFiber.parent
	}

	console.log(fiber)
}

const reconcileChildren = (fiber, children) => {
	// children可能是对象也可能是数组
	// 将children 转换为数组
	const arrifiedChildren = arrified(children)
	// 循环children 使用的索引
	let index = 0
	// children 数组中元素的个数
	let numberOfElements = arrifiedChildren.length
	// 循环过程中的循环项 就是子节点的 virtualDOM 对象
	let element = null
	// 子级 fiber 对象
	let newFiber = null
	/**
	 * 上一个兄弟 fiber 对象
	 */
	let prevFiber = null

	let alternate = null

	// 创建 fiber 节点
	// if (fiber.alternate && fiber.alternate.child) {
	// 	alternate = fiber.alternate.child
	// }

	while (index < numberOfElements) {
		// 子级 virtualDOM 对象
		element = arrifiedChildren[index]
		newFiber = {
			type: element.type,
			props: element.props,
			tag: getTag(element),
			effects: [],
			// 追加节点：placement， 删除：delete， 更新： update
			effectTag: 'placement',
			parent: fiber,
		}

		// stateNode 可能为当前节点真实 DOM 对象，也可能为组件实例对象，利用 createStateNode 处理
		newFiber.stateNode = createStateNode(newFiber)

		// 构建节点关系
		if (index === 0) {
			fiber.child = newFiber
		} else {
			prevFiber.sibling = newFiber
		}
		prevFiber = newFiber

		index++
	}
}

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
	requestIdleCallback(performTask)

	/**
	 * 任务：通过 vdom 对象构建 fiber 对象
	 * 任务队列：数组，存储各种任务
	 */
}
