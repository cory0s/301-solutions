function Creature(creature){
    this.name = creature.title;
    this.image_url = creature.image_url;
    this.description = creature.description;
    this.keyword = creature.keyword;
    this.horns = creature.horns;
    if(!keywords.includes(this.keyword)){keywords.push(this.keyword)};
}

Creature.prototype.render = function(){
    let template = $('#handlebars-template').html();
    let templateRender = Handlebars.compile(template);
    return templateRender(this);
}
