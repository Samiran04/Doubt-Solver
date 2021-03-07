class commentsClass{
    constructor(postId)
    {
        this.postId = postId;
        this.postCointainer = $(`#post-${postId}`);
        this.commentsForm = $(`#comments-${postId}-form`);

        this.createComment(postId);
    }

    createComment = function(postId){
        let pSelf = this;

        this.commentsForm.submit(function(e){
            e.preventDefault();
            let self = this;

            $.ajax({
                type: 'post',
                url: '/comments/create',
                data: $(self).serialize(),
                success: function(data) {
                    let newComments = pSelf.newCommentsDOM(data.data.comment);
                    $(`#post-comment-${postId}-cointainer`).prepend(newComments);

                    pSelf.deleteComment($(' .comments-delete-button', newComments));
                },
                error: function(error) {
                    console.log(error.responseText)
                }
            })
        })
    }

    newCommentsDOM = function(comment) {
        return $(`<li id="comment-${comment._id}">
        <a class="comments-delete-button" href="/comments/destroy/${comment._id}">X</a>
        <p> ${comment.content} </p>
        <small><p> ${comment.user.name} </p></small>
    </li>`);
    }

    deleteComment = function(deleteLink){
        $(deleteLink).click(function(e) {
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#comment-${data.data.commentId}`).remove();
                }
            });
        })
    }
}