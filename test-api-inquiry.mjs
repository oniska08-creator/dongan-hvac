async function testInquiryFlow() {
    try {
        console.log('Testing Inquiry POST (Simulating Contact Page)...');
        const postRes = await fetch('http://localhost:3000/api/inquiries', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                customerName: 'AURA AI Test',
                contact: '010-0000-0000',
                area: 'AI Lab 50평',
                content: 'Testing Supabase CRM Integration.'
            })
        });
        const postData = await postRes.json();
        console.log('POST Response:', postData);

        console.log('Testing GET (Simulating Admin Page)...');
        const getRes = await fetch('http://localhost:3000/api/inquiries');
        const getData = await getRes.json();
        console.log('Current Inquiries Count:', getData.length);
        console.log('Latest Inquiry:', getData[0]);
    } catch (e) {
        console.error(e);
    }
}
testInquiryFlow();
