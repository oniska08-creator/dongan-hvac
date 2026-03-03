async function testAPI() {
    try {
        const response = await fetch('http://localhost:3000/api/portfolio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: 'NextJS API Test',
                solution: 'API Route',
                date: '2026-02-26'
            })
        });
        const data = await response.json();
        console.log('POST Response:', data);

        const getResponse = await fetch('http://localhost:3000/api/portfolio');
        const getData = await getResponse.json();
        console.log('GET Response length:', getData.length);
        console.log('GET Response [0]:', getData[0]);
    } catch (e) {
        console.error(e);
    }
}
testAPI();
