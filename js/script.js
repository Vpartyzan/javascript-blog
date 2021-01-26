'use strict';

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post-author',
  optTagsListSelector = '.tags.list',
  optCloudClassCount = 5,
  optCloudClassPrefix = 'tag-size-';

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
  const titleList = document.querySelector(optTitleListSelector);
  
  /* [DONE] remove contents of titleList */
  clearMessages();

  function clearMessages(){    
    titleList.innerHTML = '';
  }

  /* [DONE] for each article */
  const articles = document.querySelectorAll(optArticleSelector + customSelector); 

  for (let article of articles) {
    /* [DONE] get the article id */
    const articleId = article.id;
    
    /* [DONE] find the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;

    /* [DONE] create HTML of the link */
    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    
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
    classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1);

  return classNumber;
}

function generateTags(){
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};
  
  /* [DONE] find all articles */
  const articles = document.querySelectorAll(optArticleSelector);  
  
  /* [DONE] START LOOP: for every article: */
  for (let article of articles) {
    
    /* [DONE] find tags wrapper */
    const tagWrapper = article.querySelector(optArticleTagsSelector);

    /* [DONE] make html variable with empty string */
    let html = '';

    /* [DONE] get tags from data-tags attribute & split tags into array */
    const articleTagsArray = article.getAttribute('data-tags').split(' ');
    
    /* [DONE] START LOOP: for each tag */
    for (let tag of articleTagsArray) {
      /* [DONE] generate HTML of the link */     
      const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
      
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
  let allTagsHTML = '';

  /* [NEW] START LOOP: for each tag in allTags: */
  for (let tag in allTags) {
    /* [NEW] generate code of a link and add it to allTagsHTML */
    const linkHTML = '<li><a href="#tag-' + tag + '" class="' + optCloudClassPrefix + calculateTagClass(allTags[tag], tagsParams) + '">' + tag + '</a></li>';
    
    allTagsHTML += linkHTML;
  }
  /* [NEW] END LOOP: for each tag in allTags: */

  /*[NEW] add HTML from allTagsHTML to tagList */
  tagList.innerHTML = allTagsHTML;
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
  const articles = document.querySelectorAll(optArticleSelector);  

  for (let article of articles) {
    const articleAuthor = article.querySelector(optArticleAuthorSelector),   
      authors = article.getAttribute('data-author'),    
      linkHTML = '<a href="#author-'+ authors + '">' + authors + '</a>';
    
    articleAuthor.insertAdjacentHTML('beforeend', linkHTML);    
  }  
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