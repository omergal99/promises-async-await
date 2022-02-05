import { myPromiseAllSettled, myPromiseAllSettledByObject, myPromiseAllSettledIngredients } from './myPromises.js'

const sleepReject = (ms) => {
    return new Promise((_, reject) => {
        setTimeout(() => {
            console.log('reject', ms)
            return reject(new Error(`Faild task ms=${ms}`));
        }, ms);
    })
};

const sleepResolve = (ms) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('resolve', ms)
            return resolve(ms);
        }, ms);
    })
};

const getPromise1 = () => sleepReject(1000);
const getPromise2 = () => sleepResolve(500);
const getPromise3 = () => sleepResolve(1500);
const getPromiseList = () => [getPromise1(), getPromise2(), getPromise3()];

const thenCatchFunction = (tasks) => {
    const promisesRes = [];
    return tasks[0].then(res => {
        promisesRes.push(res);
        return tasks[1].then(res => {
            promisesRes.push(res);
            return tasks[2].then(res => {
                promisesRes.push(res);
                return promisesRes;
            }).catch(err => {
                throw err;
            })
        }).catch(err => {
            throw err;
        })
    }).catch(err => {
        throw err;
    })
}

const asyncAwaitFunction = async (tasks) => {
    let promisesRes = [];
    const promise1 = tasks[0];
    const promise2 = tasks[1];
    const promise3 = tasks[2];
    try {
        const promise1Res = await promise1;
        promisesRes.push(promise1Res);
    } catch (err) {
        promisesRes.push(err);
    }
    try {
        const promise2Res = await promise2;
        promisesRes.push(promise2Res);
    } catch (err) {
        promisesRes.push(err);
    }
    try {
        const promise3Res = await promise3;
        promisesRes.push(promise3Res);
    } catch (err) {
        promisesRes.push(err);
    }
    return promisesRes;
}

// implement Promise.allSettled using Promise.All
const promiseAllFunction = async (tasks) => {
    let promisesRes, promiseRejError;
    try {
        // promisesRes async await
        promisesRes = await Promise.all(tasks.map(async promise => {
            try {
                const res = await promise;
                return { status: 'fulfilled', value: res, };
            } catch (err) {
                return { status: 'rejected', reason: err, };
            }
        }));
        // // promisesRes .then().catch()
        // promisesRes = await Promise.all(getPromiseList().map(promise => {
        //     return promise
        //         .then(res => { return { status: 'fulfilled', value: res, } })
        //         .catch((err) => { return { status: 'rejected', reason: err, } })
        // }));
    } catch (err) { // handle the catch if one faild and there is no catch for him
        promiseRejError = err;
        throw err;
    } finally {
        if (promiseRejError) {
            return promiseRejError;
        }
        return promisesRes;
    }
}

const promiseAllSettledFunction = async (tasks) => {
    let promisesRes, promiseRejError;
    try {
        promisesRes = await Promise.allSettled(tasks);
    } catch (err) {
        promiseRejError = err;
        throw err;
    } finally {
        if (promiseRejError) {
            return promiseRejError
            // throw promiseRejError;
        }
        return promisesRes;
    }
}

const init = async () => {
    const tasks = [
        thenCatchFunction,
        asyncAwaitFunction,
        promiseAllFunction,
        promiseAllSettledFunction,
    ]
    const res = await myPromiseAllSettled(tasks.map(task => task(getPromiseList())));
    console.log('res', { res }); // TODO: remove log

    // const res2 = await myPromiseAllSettledByObject({
    //     thenCatchFunction: thenCatchFunction(),
    //     asyncAwaitFunction: asyncAwaitFunction(),
    //     promiseAllFunction: promiseAllFunction(),
    //     promiseAllSettledFunction: promiseAllSettledFunction(),
    // });
    // console.log('res2', res2); // TODO: remove log


    // const res3 = await myPromiseAllSettledIngredients([
    //     { function: thenCatchFunction, args: [] },
    //     { function: asyncAwaitFunction, args: [], key: 'mamaam' },
    //     { function: promiseAllFunction, args: [], key: 'blabla' },
    //     { function: promiseAllSettledFunction, args: [getPromiseList()] },
    // ])
    // console.log('res3', res3); // TODO: remove log


}
init()
