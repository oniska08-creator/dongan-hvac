async function testUpdateDelete() {
    try {
        console.log('Testing GET to find an item...');
        const getResponse = await fetch('http://localhost:3000/api/portfolio');
        const getData = await getResponse.json();

        if (getData.length === 0) {
            console.log('No item to update/delete.');
            return;
        }

        const item = getData[0];
        console.log('Target item ID to update/delete:', item.id);

        console.log('Testing PUT...');
        const putResponse = await fetch(`http://localhost:3000/api/portfolio/${item.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...item,
                title: 'Updated Title API Test'
            })
        });
        const putData = await putResponse.json();
        console.log('PUT Response:', putData);

        console.log('Testing DELETE...');
        const deleteResponse = await fetch(`http://localhost:3000/api/portfolio/${item.id}`, {
            method: 'DELETE'
        });
        const deleteData = await deleteResponse.json();
        console.log('DELETE Response:', deleteData);

    } catch (e) {
        console.error(e);
    }
}
testUpdateDelete();
