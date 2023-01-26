//get json from api
async function getDocuments() {
    let url = 'https://app.overton.io/documents.php?query=title%3A%22air+quality%22+or+%22pollution%22&source=govuk&sort=citations&format=json&api_key=2e73d1-689eadef86e9ce113bc904eb09d4d52c';
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}
// make HTML for each document
async function render() {
    let docs = await getDocuments();
    console.log(docs)

    let html = '';
    docs.results.forEach(doc => {

        let moreHTML = "";
        if (doc.topics.length && doc.topics.length > 3){
            moreHTML = `<div class="topics-container">
                            <span class="topics">${doc.topics.slice(0, 3).join(', ')}</span>
                            <span class="topics" id="elipsis${doc.policy_document_id}">...</span>
                            <button onclick="moreFunction('${doc.policy_document_id}')" class="more-button" id="btn${doc.policy_document_id}">More topics</button>
                            <span class="topics more" id="more${doc.policy_document_id}">${doc.topics.slice(3, doc.topics.length-1).join(', ')}</span>
                        </div>`
                         
        }
        else if (doc.topics.length && doc.topics.length > 0 &&  doc.topics.length <= 3 ){
            moreHTML = `<div class="topics">${doc.topics.join(', ')}</div> `
        }

        let htmlSegment = `<div class="document">
                                <div class="inner-column">
                                    <img src="${doc.thumbnail}" >
                                </div>
                                <div class="inner-column">
                                    <div class="title">${doc.title}</div>
                                    <div class="authors">by ${doc.authors.join(', ')}</div>
                                    <div class="published">${doc.published_on}</div>
                                    <div class="snippet">${doc.snippet}</div>
                                    ${moreHTML}
                                </div>
                            </div>`;

        html += htmlSegment;
    });

    let container = document.querySelector('.document-list');
    container.innerHTML = html;
}

// show more topics
function moreFunction(id) {
  var elipsis = document.getElementById("elipsis"+ id);
  var moreText = document.getElementById("more" + id);
  var btnText = document.getElementById("btn" + id);

  if (elipsis.style.display === "none") {
    elipsis.style.display = "inline";
    btnText.innerHTML = "More topics";
    moreText.style.display = "none";
  } else {
    elipsis.style.display = "none";
    btnText.innerHTML = "Show less";
    moreText.style.display = "inline";
  }
} 

render();