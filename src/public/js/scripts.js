$('[id=btn-like]').click(function(e) {
    e.preventDefault();
    let comment_id = $(this).data('id');
    $.post('/comment/like/' + comment_id)
        .done(data => {
            $('[id=likes]').each((index, element) => {
                let id = element.dataset.id;
                if (id === comment_id) {
                    element.textContent = data.likes
                }
            })

        });
});
$('[id=btn-dislike]').click(function(e) {
    e.preventDefault();
    let comment_id = $(this).data('id');
    $.post('/comment/dislike/' + comment_id)
        .done(data => {
            $('[id=dislikes]').each((index, element) => {
                let id = element.dataset.id;
                if (id === comment_id) {
                    element.textContent = data.dislikes
                }
            })

        });
});

$('[id=btn-delete]').each((index, element) => {
    let user = element.dataset.user;
    let user2 = element.dataset.user2;

    if (user !== user2) {
        console.log(user2);
        element.hidden = true;
    }

});