function getTotals(){
    const url = `${window.origin}/graphql`;
    const query = '{totalUsers, totalPhotos}'
    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({query})
    }
    fetch(url, options)
    .then(res => res.json())
    .then(json => json.data)
    .then(data => 
        `<p><strong>Total Users:</strong> ${data.totalUsers}</p>
         <p><strong>Total Photos:</strong> ${data.totalPhotos}</p>
        `
     )
     .then(str => document.getElementById('content').innerHTML = str)
    .catch(err => console.error(err));
}
