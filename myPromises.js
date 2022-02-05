
// implement Promise.allSettled using Promise.All
export const myPromiseAllSettled = async (tasks) => {
  return await myPromiseAll(tasks.map(async promise => {
    try {
      const res = await promise;
      return { status: 'fulfilled', value: res, };
    } catch (err) {
      return { status: 'rejected', reason: err, };
    }
  }));
}

// implement Promise.All using new Promise
const myPromiseAll = async (tasks) => {
  if (!tasks.length) {
    Promise.resolve([]);
    return;
  }
  return new Promise(async (resolve, reject) => {
    const tasksLength = tasks.length;
    const results = [];
    let finisedTasksCounter = 0;

    const handleFinishTask = (res, idx) => {
      results[idx] = res;
      finisedTasksCounter += 1;
      if (finisedTasksCounter === tasksLength) {
        resolve(results);
      }
    }

    tasks.forEach(async (task, idx) => {
      if (typeof task === 'object' && 'then' in task && typeof task.then === 'function') {
        try {
          const res = await task;
          handleFinishTask(res, idx);
        } catch (err) {
          reject(err);
        }
      } else {
        handleFinishTask(await Promise.resolve(task), index);
        // Promise.resolve(task).then(res => handleFinishTask(res, index));
      }
    })
  })
}

const byNewPromise = async (arr) => {
  return new Promise(async (resolve, reject) => {
    let finisedTasksCounter = 0;
    const results = []
    arr.forEach(async task => {
      console.log('{task}', { task }); // TODO: remove log
      try {
        const res = await task;
        return results.push({ status: 'fulfilled', value: res, });
      } catch (err) {
        return results.push({ status: 'rejected', reason: err, });
      } finally {
        finisedTasksCounter += 1;
        if (arr.length === finisedTasksCounter) {
          resolve(results);
        }
      }
    })
  })
}