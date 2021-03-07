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
                    deletePost($(' .delete-post-button', newPost));

                    new commentsClass(data.data.post._id);

                    new Noty({
                        theme: 'relax',
                        text: "Post published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                },
                error: function(error){
                    console.log(error.responceText);
                }
            })
        });
    }

    let newPostDOM = function(post){
        return $(`
            <li id="post-${post._id}">
                <a class="delete-post-button" href="/posts/destroy/${post._id}">X</a>
                <div id="post-content"><p> ${post.content} </p></div>
                <small><p> ${post.user.name} </p></small>
                <ul id="post-comment-${post._id}-cointainer">
                    <form action="/comments/create" id="comments-${post._id}-form" method="POST">
                        <input type="text" name="content" placeholder="Type Comments..." required>
                        <input type="hidden" name="post" value="${post._id}">
                        <input type="submit" name="Add Comment">                       
                    </form>
                </ul>
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
                    $(`#post-${data.data.postId}`).remove();

                    new Noty({
                        theme: 'relax',
                        text: "Post deleted!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                },
                error: function(error){
                    console.log(error.responceText);
                }
            })
        });
    }

    let convertPostsToAjax = function(){
        $('#posts-list-cointainer>ul>li').each(function(){
            let self = $(this);
            let deleteButton = $(' .delete-post-button', self);
            deletePost(deleteButton);

            // get the post's id by splitting the id attribute
            let postId = self.prop('id').split("-")[1]
            new commentsClass(postId);
        });
    }

    createPost();
    convertPostsToAjax();
}