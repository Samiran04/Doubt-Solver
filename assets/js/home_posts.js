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
                    deletePost($(' .delete-comment-button', newPost));
                },
                error: function(error){
                    console.log(error.responceText);
                }
            })
        });
    }

    let newPostDOM = function(post){
        return $(`
            <li id="post-${post.id}">
                <a class="delete-comment-button" href="/posts/destroy/${post.id}">X</a>
                <div id="post-content"><p> ${post.content} </p></div>
                <small><p> ${post.user.name} </p></small>
            </li>
    `)
    }

    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#post-${data.data.postId}`).remove()
                },
                error: function(error){
                    console.log(error.responceText);
                }
            })
        });
    }

    createPost();
}