function Creature(creature){
    this.name = creature.title;
    this.image_url = creature.image_url;
    this.description = creature.description;
    this.keyword = creature.keyword;
    this.horns = creature.horns;
    if(!keywords.includes(this.keyword)){keywords.push(this.keyword)};
}

Creature.prototype.render = function(){
    $('main').append('<div class="temp">placeholder</div>');
    const temp = $('.temp');
    const photoTemplate = $('#photo-template').html();

    temp.html(photoTemplate);
    temp.find('h1').append(this.name);
    temp.find('img').attr('src', this.image_url);
    temp.find('p').append(this.description);
    temp.removeClass('temp');
    temp.addClass(this.keyword);
}
