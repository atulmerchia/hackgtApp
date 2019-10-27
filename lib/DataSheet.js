const PELSJ4U = 'https://thecowsaysmeow.herokuapp.com';

class DataSheet {}

DataSheet.data = [];
DataSheet.cumsum = 0;
DataSheet.refreshing = false;
DataSheet.push = d => {
  DataSheet.data.push(d);
  let i = DataSheet.data.length - 1;
  DataSheet.update();
  fetchRequest(d.data, i)
}
DataSheet.refresh = _ => {
  DataSheet.refreshing = true;
  DataSheet.update();
  Promise.all(DataSheet.data.map((d,i) => d.Name ? Promise.resolve(d) : fetchRequest(d.data, i)))
  .finally(_ => {DataSheet.refreshing = false; DataSheet.update();} )
}
DataSheet.remove = i => { DataSheet.cumsum -= (DataSheet.data.splice(i, 1)[0].Price || 0); DataSheet.update(); }
DataSheet.another = i => { DataSheet.cumsum += DataSheet.data[i].Price; DataSheet.data.push(DataSheet.data[i]); DataSheet.update(); }
DataSheet.clear = d => { DataSheet.data = []; DataSheet.cumsum = 0; DataSheet.update(); }
DataSheet.registerViewController = ref => { DataSheet.listview = ref };
DataSheet.update = _ => DataSheet.listview.setState({ data: DataSheet.data });

DataSheet.sendOrderRequest = _ => fetch(PELSJ4U + "/checkout", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  body: JSON.stringify({
    key: keygen(),
    val: DataSheet.data.map(d => d.Barcode || d.data)
  })
}).then(res => {
  if(res.status === 200) return res.json();
  else throw res.json();
}).then(res => res.key)
.catch(async err => {
  if(err.then) err = await err;
  console.log(err)
});

DataSheet.void = key => fetch(PELSJ4U + "/checkout", {
  method: "DELETE",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  body: JSON.stringify({key})
}).catch(err => {});

export default DataSheet;

const fetchRequest = (data, i) => fetch(PELSJ4U + "/item?Barcode=" + encodeURIComponent(data))
  .then(res => {
    if(res.status === 200) return res.json();
    else throw res.json();
  }).then(res => {
    DataSheet.data[i] = res;
    DataSheet.cumsum += res.Price;
    DataSheet.update();
  }).catch(async err => {
    if(err.then) err = await err;
    console.log(err)
  });

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
const keygen = _ => {
  let s = ""; let x = 16;
  while(x--) s += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  return s;
}
