'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  articleTag: Handlebars.compile(document.querySelector('#template-article-tag').innerHTML),
  articleAuthor: Handlebars.compile(document.querySelector('#template-article-author').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud').innerHTML),
  authorCloudLink: Handlebars.compile(document.querySelector('#template-author-cloud').innerHTML)
};

const opt = {
  articleSelector: '.post',
  titleSelector: '.post-title',
  titleListSelector: '.titles',
  articleTagsSelector: '.post-tags .list',
  articleAuthorSelector: '.post-author',
  cloudClassCount: 5,
  cloudClassPrefix: 'tag-size-',
  authorListSelector: '.authors'
};

const titleClickHandler = function(event){
  event.preventDefault();

  const clickedElement = this;

  /* [DONE] remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');
    
  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }

  /* [DONE] add class 'active' to the clicked link */
  clickedElement.classList.add('active');

  /* [DONE] remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts .active');
    
  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }

  /* [DONE] get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');

  /* [DONE] find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);

  /* [DONE] add class 'active' to the correct article */
  targetArticle.classList.add('active');

};

function generateTitleLinks(customSelector = ''){
  const titleList = document.querySelector(opt.titleListSelector);
  
  /* [DONE] remove contents of titleList */
  clearMessages();

  function clearMessages(){    
    titleList.innerHTML = '';
  }

  /* [DONE] for each article */
  const articles = document.querySelectorAll(opt.articleSelector + customSelector); 

  for (let article of articles) {
    /* [DONE] get the article id */
    const articleId = article.id;
    
    /* [DONE] find the title element */
    const articleTitle = article.querySelector(opt.titleSelector).innerHTML;

    /* [DONE] create HTML of the link */
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);
    
    /* [DONE] insert link into titleList */
    titleList.insertAdjacentHTML('beforeend', linkHTML);
  }

  const links = document.querySelectorAll('.titles a');

  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }

}

generateTitleLinks();

function calculateTagsParams (tags) {
  const params = {
    max: 0,
    min: 999999
  };
  
  for (let tag in tags) {
    (tags[tag] > params.max) ? params.max = tags[tag] : params.max;
    (tags[tag] < params.min) ? params.min = tags[tag] : params.min;
  }
  
  return params;
}

function calculateTagClass (count, params) {
  const normalizedCount = count - params.min,
    normalizedMax = params.max - params.min,
    percentage = normalizedCount / normalizedMax,
    classNumber = Math.floor( percentage * (opt.cloudClassCount - 1) + 1);

  return classNumber;
}

function generateTags(){
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};
  
  /* [DONE] find all articles */
  const articles = document.querySelectorAll(opt.articleSelector);  
  
  /* [DONE] START LOOP: for every article: */
  for (let article of articles) {
    
    /* [DONE] find tags wrapper */
    const tagWrapper = article.querySelector(opt.articleTagsSelector);

    /* [DONE] make html variable with empty string */
    let html = '';

    /* [DONE] get tags from data-tags attribute & split tags into array */
    const articleTagsArray = article.getAttribute('data-tags').split(' ');
    
    /* [DONE] START LOOP: for each tag */
    for (let tag of articleTagsArray) {
      /* [DONE] generate HTML of the link */
      const linkHTMLData = {id: tag, title: tag};     
      const linkHTML = templates.articleTag(linkHTMLData);
      
      /* [DONE] add generated code to html variable */
      html = html + linkHTML;

      /* [NEW] check if this link is NOT already in allTags */
      if (!allTags[tag]) {
        /* [NEW] add generated code to allTags object */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
      /* [DONE] END LOOP: for each tag */
    }
    
    /* [DONE] insert HTML of all the links into the tags wrapper */
    tagWrapper.insertAdjacentHTML('beforeend', html);

    /* [DONE] END LOOP: for every article: */    
  }
  
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector('.tags');
  
  const tagsParams = calculateTagsParams(allTags);
  
  /* [NEW] create variable for all links HTML code */
  const allTagsData = {tags: []};

  /* [NEW] START LOOP: for each tag in allTags: */
  for (let tag in allTags) {
    /* [NEW] generate code of a link and add it to allTagsHTML */     
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: opt.cloudClassPrefix + calculateTagClass(allTags[tag], tagsParams),      
    });
  }
  /* [NEW] END LOOP: for each tag in allTags: */

  /*[NEW] add HTML from allTagsHTML to tagList */
  tagList.innerHTML = templates.tagCloudLink(allTagsData);  
}

generateTags();

function tagClickHandler(event){
  /* [DONE] prevent default action for this event */
  event.preventDefault();

  /* [DONE] make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;

  /* [DONE] make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  
  /* [DONE] make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  

  /* [DONE] find all tag links with class active */
  const activeLinks = document.querySelectorAll('a.active[href^="#tag-"]');
  
  /* [DONE] START LOOP: for each active tag link */
  for (let activeLink of activeLinks) {
    /* [DONE] remove class active */
    activeLink.classList.remove('active');
    /* [DONE] END LOOP: for each active tag link */
  }  

  /* [DONE] find all tag links with "href" attribute equal to the "href" constant */
  const foundTagLinks = document.querySelectorAll('a[href="' + href + '"]');
  
  /* [DONE] START LOOP: for each found tag link */
  for (let foundTagLink of foundTagLinks) {
    /* [DONE] add class active */
    foundTagLink.classList.add('active');
    /* [DONE] END LOOP: for each found tag link */    
  }  

  /* [DONE] execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){
  /* [DONE] find all links to tags */
  const tagLinks = document.querySelectorAll('a[href^="#tag-"');  
  
  /* [DONE] START LOOP: for each link */
  for (let tagLink of tagLinks) {
    /* [DONE] add tagClickHandler as event listener for that link */
    tagLink.addEventListener('click', tagClickHandler);
  /* [DONE] END LOOP: for each link */
  }  
}

addClickListenersToTags();

function generateAuthors () {
  let allAuthorLinks = {};

  const articles = document.querySelectorAll(opt.articleSelector);  

  for (let article of articles) {
    const articleAuthor = article.querySelector(opt.articleAuthorSelector),        
      authors = article.getAttribute('data-author'),
      authorTags = authors.split(' ').join('-').split(' '),
      linkHTMLData = {className: authors, title: authors},    
      linkHTML = templates.articleAuthor(linkHTMLData);      
    
    for (let authorTag of authorTags ) {
      const authorName = authorTag.split('-').join(' ');      

      (!allAuthorLinks[authorName]) ? allAuthorLinks[authorName] = 1 : allAuthorLinks[authorName]++;
    }    

    articleAuthor.insertAdjacentHTML('beforeend', linkHTML);        
  } 

  const authorLinks = document.querySelector(opt.authorListSelector);
  const allAuthorsData = {authors: []};

  for (let authorLink in allAuthorLinks) {    
    allAuthorsData.authors.push({
      author: authorLink,
      count: allAuthorLinks[authorLink],
      link: authorLink
    });   
  }
  authorLinks.insertAdjacentHTML('beforeend', templates.authorCloudLink(allAuthorsData)); 
}

generateAuthors();

function authorClickHandler (event) {
  event.preventDefault();

  const clickedElement = this,  
    href = clickedElement.getAttribute('href'),
    author = href.replace('#author-', ''),
    foundAuthorLinks = document.querySelectorAll('a[href="' + href + '"]');  
  
  for (let foundAuthorLink of foundAuthorLinks) {    
    foundAuthorLink.classList.add('active');       
  } 
  
  generateTitleLinks('[data-author="' + author + '"]');  
}

function addClickListenersToAuthors () {
  const authorLinks = document.querySelectorAll('a[href^="#author-"]');
  
  for (let authorLink of authorLinks) {
    authorLink.addEventListener('click', authorClickHandler);
    
  }
}

addClickListenersToAuthors();