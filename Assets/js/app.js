const cl = console.log;

const title = document.getElementById("title");
const body = document.getElementById("body");
const userId = document.getElementById("userId");
const postsForm = document.getElementById("postsForm");
const postsContainer = document.getElementById("postsContainer");
const addBtn = document.getElementById("addBtn");
const updateBtn = document.getElementById("updateBtn");
const loader = document.getElementById("loader");


let BASE_URL = `https://jsonplaceholder.typicode.com`;

let POSTS_URL = `${BASE_URL}/posts`;

const onDelete = (eve) => {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
            let getId = eve.closest('.card').id;
            let deleteUrl = `${BASE_URL}/posts/${getId}`;
            loader.classList.remove('d-none');
            let xhr = new XMLHttpRequest();

            xhr.open("DELETE", deleteUrl);

            xhr.send();

            xhr.onload = () => {
                if(xhr.status >= 200 && xhr.status <= 299 && xhr.readyState === 4){
                    let data = JSON.parse(xhr.response);
                    eve.closest('.card').remove();
                    loader.classList.add('d-none');
                }
            }
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
        }
      });
}

const onEdit = (eve) => {
    loader.classList.remove('d-none');
    let getId = eve.closest('.card').id;
    localStorage.setItem("getId", getId);
    let editUrl = `${BASE_URL}/posts/${getId}`;
    let xhr = new XMLHttpRequest();

    xhr.open("GET", editUrl);

    xhr.send();

    xhr.onload = () => {
        if(xhr.status >= 200 && xhr.status <= 299 && xhr.readyState === 4){
            let data = JSON.parse(xhr.response);
            title.value = data.title;
            body.value = data.body;
            userId.value = data.userId;

            let getScrollValue = scrollY;
            
            if(getScrollValue > 100){
                window.scrollTo({
                    top : 0,
                    behavior : "smooth"
                })
            }

            addBtn.classList.add('d-none');
            updateBtn.classList.remove('d-none');
            loader.classList.add('d-none');
        }
    }
}

let result = ``
let createPostsCards = (arr) => {
    for(let i = 0; i < arr.length; i++){
        result += `
                    <div class="card mt-3" id="${arr[i].id}">
                        <div class="card-header text-capitalize">
                            <h4>${arr[i].title}</h4>
                        </div>
                        <div class="card-body text-capitalize">
                            <p>${arr[i].body}</p>
                        </div>
                        <div class="card-footer d-flex justify-content-between">
                            <button class="btn btn-primary" onclick="onEdit(this)">Edit</button>
                            <button class="btn btn-danger" onclick="onDelete(this)">Delete</button>
                        </div>
                    </div>
        `
        postsContainer.innerHTML = result;
    }
}

const fetchAllPosts = () => {
    loader.classList.remove('d-none');

    let xhr = new XMLHttpRequest();

    xhr.open("GET", POSTS_URL);

    xhr.send();

    xhr.onload = () => {
        if(xhr.status >= 200 && xhr.status <= 299 && xhr.readyState === 4){
            let data = JSON.parse(xhr.response);
            createPostsCards(data);
            loader.classList.add('d-none');

        }
}
}

fetchAllPosts();

const onSubmitBtn = (eve) => {
    loader.classList.remove('d-none');

    eve.preventDefault();
    let obj = {
        title : title.value,
        body : body.value,
        userId : userId.value
    }

    let xhr = new XMLHttpRequest();

    xhr.open("POST", POSTS_URL);

    xhr.setRequestHeader("content-type", 'application/json');
    xhr.setRequestHeader("Authorization", 'Bearer Token from LS');

    xhr.send(JSON.stringify(obj));

    xhr.onload = () => {
        if(xhr.status >= 200 && xhr.status <= 299 && xhr.readyState === 4){
            let data = JSON.parse(xhr.response);
            cl(data);

            let div = document.createElement('div');
            div.id = data.id;
            div.className = 'card mt-3';
            div.innerHTML = `
                            <div class="card-header text-capitalize">
                                <h4>${data.title}</h4>
                            </div>
                            <div class="card-body text-capitalize">
                                <p>${data.body}</p>
                            </div>
                            <div class="card-footer d-flex justify-content-between">
                                <button class="btn btn-primary" onclick="onEdit(this)">Edit</button>
                                <button class="btn btn-danger" onclick="onDelete(this)">Delete</button>
                            </div>
            
            `
            postsContainer.prepend(div);
            loader.classList.add('d-none');
            postsForm.reset();
            Swal.fire({
                title : 'A Post is Added Successfully !!!',
                icon : 'success',
                timer : 2500
            })
        }
}
}

const onUpdateClick = (eve) => {
    loader.classList.remove('d-none');
    let getId = localStorage.getItem('getId');
    let updateUrl = `${BASE_URL}/posts/${getId}`;
    let obj = {
        title : title.value,
        body : body.value,
        userId : userId.value
    }

    let xhr = new XMLHttpRequest();

    xhr.open("PATCH", updateUrl);

    xhr.setRequestHeader("content-type", 'application/json');
    xhr.setRequestHeader("Authorization", 'Bearer Token from LS');
    
    xhr.send(JSON.stringify(obj));

    xhr.onload = () => {
        if(xhr.status >= 200 && xhr.status <= 299 && xhr.readyState === 4){
            let data = JSON.parse(xhr.response);
            let card = [...document.getElementById(getId).children];
            card[0].innerHTML = `<h4>${obj.title}</h4>`;
            card[1].innerHTML = `<p>${obj.body}</p>`;
            updateBtn.classList.add('d-none');
            addBtn.classList.remove('d-none');
            loader.classList.add('d-none');
            postsForm.reset();
            Swal.fire({
                title : 'A Post is Updated Successfully !!!',
                icon : 'success',
                timer : 2500
            })
        }
}
}

postsForm.addEventListener("submit", onSubmitBtn);
updateBtn.addEventListener("click", onUpdateClick);