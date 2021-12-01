function saveButton(){
const buttonParent = this.closest("div")
 let ancorButton=buttonParent.querySelector("a").href
 let imgSource=buttonParent.querySelector("img").src
 console.log('the save button has been clicked!', ancorButton, imgSource)
 fetch('savedArticle', {
method: 'put',
headers: {'Content-Type': 'application/json'},
body: JSON.stringify({
 ancorButton:ancorButton,
 imgSource:imgSource

})
})

}
function apiCall(){
 let nameOfObject = document.querySelector('#apiSearch').innerText
 let apiOutcome=document.querySelector("#apiOutcome")
 // nameOfObject=nameOfObject.split(' ').join('%20')
  fetch (`https://www.googleapis.com/customsearch/v1?key=AIzaSyDNPtBdXEkN_R85DDzctdkmOK1OQJ99dZA&cx=8cb38a72715546101&q=${nameOfObject}`)
  .then (res => res.json())
    .then(data=>{
      for(i=0; i<data.items.length; i++){
        let li=document.createElement('li')
        let div=document.createElement('div')
        let img=document.createElement('img')
        let link= document.createElement('a')
        let p=document.createElement('p')
        let button=document.createElement('button')
        img.src=data.items[i].pagemap.cse_image[0].src
        link.target="_blank"
        link.href= `https://${data.items[i].displayLink}`
        p.innerText= data.items[i].title
        button.innerText= "Save it!"
        apiOutcome.appendChild(li)
        li.appendChild(div)
        div.appendChild(img)
         div.appendChild(link)
        link.appendChild(p)
        div.appendChild(button)
        button.onclick= saveButton
      }
      console.log(data)
      console.log(data.context.title)
    })
}
apiCall()
