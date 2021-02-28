{
    let createPost = function(){
        let newPostForm = $('#post-form');

        newPostForm.submit(function(e){
            e.preventDefault();
            
            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function(data){
                    let newPost = newPostDOM(data.data.post);
                    console.log(data.data.post);
                    $('#posts-list-cointainer>ul').prepend(newPost);
                },
                error: function(error){
                    console.log(error.responceText);
                }
            })
        });
    }

    let newPostDOM = function(post){
        return $(`<ul>
            <li>
                <a href="/posts/destroy/${post.id}">X</a>
                <div id="post-content"><p> ${post.content} </p></div>
                <small><p> ${post.user.name} </p></small>
            </li>
    </ul>`)
    }

    createPost();
}