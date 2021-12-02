
let trash= document.querySelectorAll(".trash")
trash.forEach((button) => {
  button.addEventListener('click', deleteItem)

});

function deleteItem(e){

  // let item= e.target.parentNode.querySelector('img').src
  let item = e.target.parentNode.querySelector('img').src
  let trashid = this.dataset.bob
  console.log("from trash secondary",item)
  console.log("the trashid", trashid)
  fetch("deleteContent", {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      trash: trashid,
    }),
  }).then(function (response) {
    // window.location.reload();
  });
}
