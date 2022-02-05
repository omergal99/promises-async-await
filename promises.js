

const sleepReject = (ms) => new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log('reject', ms)
        return reject(new Error(`Faild task ms=${ms}`));
    }, ms);
});

const sleepResolve = (ms) => new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log('resolve', ms)
        return resolve(ms);
    }, ms);
});

const promise1 = sleepReject(1000);
const promise2 = sleepResolve(500);
const promise3 = sleepResolve(1500);
const promisesList = [promise1, promise2, promise3];

const thenCatchFunction = () => {
    const promisesRes = [];
    return promise1.then(res => {
        console.log('promise1 then'); // TODO: remove log
        promisesRes.push(res);
        return promise2.then(res => {
            console.log('promise2 then'); // TODO: remove log
            promisesRes.push(res);
            return promise3.then(res => {
                console.log('promise3 then'); // TODO: remove log
                promisesRes.push(res);
                return promisesRes
            }).catch(err => {
                return err;
            })
        }).catch(err => {
            return err;
        })
    }).catch(err => {
        return err;
    })

}

const asyncAwaitFunction = async () => {
    let promisesRes = [], promiseRejError;
    try {
        const promise1Res = await promise1;
        const promise2Res = await promise2;
        const promise3Res = await promise3;
        promisesRes.push(promise1Res)
        promisesRes.push(promise2Res)
        promisesRes.push(promise3Res)
    } catch (err) {
        promiseRejError = err;
        console.log({ err })
        throw err;
    } finally {
        if (promiseRejError) {
            return promiseRejError
            // throw promiseRejError; // when throw error the next code will not run
        }
        return promisesRes;
    }
}

const promiseAllFunction = async () => {
    let promisesRes, promiseRejError;
    try {
        promisesRes = await Promise.all(promisesList.map(promise => {
            return promise
                .then(res => { return { status: 'fulfilled', value: res, } })
                .catch((err) => { return { status: 'rejected', reason: err, } })
        }));
    } catch (err) { // handle the catch if one faild and there is no catch for him
        promiseRejError = err;
        console.log({ err });
        // throw err;
    } finally {
        if (promiseRejError) {
            // return promiseRejError
        }
        return promisesRes;
    }
}

const promiseAllSettledFunction = async () => {
    let promisesRes, promiseRejError;
    try {
        promisesRes = await Promise.allSettled(promisesList);
    } catch (err) {
        promiseRejError = err;
        console.log({ err });
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
    // console.log("thenCatchFunction", await thenCatchFunction());
    // console.log("asyncAwaitFunction", await asyncAwaitFunction());
    console.log("promiseAllFunction", await promiseAllFunction());
    console.log("promiseAllSettledFunction", await promiseAllSettledFunction());
}
init()