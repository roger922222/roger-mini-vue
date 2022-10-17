const queue: any[] = []
const activePreFlushCbs: any[] = []
let isFlushPending = false

const p = Promise.resolve()

export function nextTick(fn?) {
  return fn ? p.then(fn) : p
}

export function queueJobs(job) {
  if (!queue.includes(job)) queue.push(job)

  queueFlush()
}

export function queuePreFlushCb(job) {
  activePreFlushCbs.push(job)
  queueFlush()
}

function queueFlush() {
  if (isFlushPending) return
  isFlushPending = true
  nextTick(flushJobs)
}

function flushJobs() {
  isFlushPending = false

  // 组件渲染前
  flushPreFlusCbs()

  // compoent render
  let job
  while ((job = queue.shift())) {
    job && job()
  }
}

function flushPreFlusCbs() {
  for (let i = 0; i < activePreFlushCbs.length; i++) {
    activePreFlushCbs[i]()
  }
}