(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://checkout.culqi.com/v2";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'culqijs'));