module.exports = async db => {
    const list = await db.collection('users').where({}).get().then(res => res.data.map(item =>({_id: item._id, proEndDate: item.proEndDate})));

    let time;
    for(item of list) {
        // console.log('123', item.proEndDate)
        if(typeof item.proEndDate === 'number') continue;
        try {
            time = new Date(item.proEndDate || Date.now()).getTime();
        } catch (error) {
            time = Date.now()
        }
        await db.collection('users').doc(item._id).update({
            data: {
                proEndDate: time
            }
        })
    }
}