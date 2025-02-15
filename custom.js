$(function() {
    $("#display-cos-id").click(function(){
        var cos_id = document.getElementById('cos-code').value;
        window.location.href = `https://w3id.org/jp-cos/${cos_id}`;
    });
 });

function get_nhk4school(cscode, page = 1) {
    /// NHK for School APIにアクセス
    const apiKey = 'QhnGtsNqZpAeaG4Sn4RlVhGs34XBL4Vq';
    const api = `https://api.nhk.or.jp/school/v2/nfsvideos/cscode/${cscode}?apikey=${apiKey}&page=${page}`;
    fetch(api)
    .then(response => {
        return response.json();
    })
    .then(data => {
        nhk(data);
    })
    .catch(function (error) {
        console.log(`失敗しました: ${error}`);
        results("<p>取得に失敗しました。</p>", page, false);
    });

    //結果を表示
    function results(html, page = 1, success = true) {
        let elmResult = document.getElementById(`nhk4school-list-${page}`);
        elmResult.innerHTML = html;
        elmResult.style.display = "block";
        if (success) {
            let elmButton = document.getElementById(`nhk4school-button-${page}`);
            elmButton.disabled = true;
        }
    }
    function nhk(data) {
        console.log(data);
        console.log(data['counts']);
        let html = ''; //出力するHTMLテキストを入れる変数
        if (data['error'] || !data['counts']) {
            html += "該当するコンテンツはありません";
        } else {
            //取得結果の概要を表示
            const pageStart = data['perPage'] * (data['page']-1) + 1;
            const pageEnd   = pageStart + data['result'].length - 1;
            html += `<h4>NHK for Schoolの動画: ${data['counts']}件中 ${pageStart} - ${pageEnd} 件</h4>`;
            //コンテンツ一覧を表示
            html +=  `<ul class="list-unstyled">`;
            for (let i = 0; i < data['result'].length; i++){
                let seriesTitle = "";
                if (data['result'][i]['url'] && data['result'][i]['about'] && data['result'][i]['about']['nfsSeriesName']) {
                    seriesTitle = ` (${data['result'][i]['about']['nfsSeriesName']})`;
                }
                const result = `
                    <li class="media">
                    <img class="bd-placeholder-img mr-3" width="25%" height="25%" src="${data['result'][i]['thumbnailUrl']}"></img>
                        <div class="media-body">
                            <h5 class="mt-0 mb-1"><a href="${data['result'][i]['url']}">${data['result'][i]['name']}</a>${seriesTitle}</h5>
                            <p class="mt-0 mb-1">${data['result'][i]['description']}</p>
                        </div>
                    </li>
                `;
                // console.log(result);
                html += result;
            }
            html += '</ul>';
        }
        if (data['page'] < data['totalPages']) {
            const nextPage = data['page'] + 1;
            html += `
                <button id="nhk4school-button-${nextPage}" type="button" class="btn btn-nhk4school" onclick="get_nhk4school('${data['queryData']['curriculumStandardCode']}', ${nextPage})">
                次の${data['perPage']}件を取得 <i class="bi bi-search"></i>
                </button>
                <div id="nhk4school-list-${nextPage}" />
            `;
        }
        results(html, data['page']);
    };
};

function get_sukilam_data(cos_id) {
    console.log(cos_id);
    let div = document.getElementById("sukilam-result");
    let sparql = `
    select * where {
      ?s <https://w3id.org/sukilam-educational-metadata/term/property#指導要領コード> <https://w3id.org/jp-cos/${cos_id}>.
      ?s rdfs:label ?label.
      ?s <https://w3id.org/sukilam-educational-metadata/term/property#学習指導案> ?url.
    }`;
    console.log(sparql);
    let url = `https://dydra.com/ut-digital-archives/oi/sparql?query=${encodeURIComponent(sparql)}&output=json`;
    console.log(url);
    fetch(url, {
        format: "json"
    })
    .then(res => res.json())
    .then(obj => {
        console.log(obj);
        results = obj["results"]["bindings"];
        let html = "";
        if (results.length == 0) {
            html = "<p>該当するコンテンツはありません</p>";
        } else {
            html = "<ul>";
            results.forEach(element => {
                let url = element["url"]["value"];
                let label = element["label"]["value"];
                html += `<li><a href="${url}">${label}</a>`
            });
            html += "</ul>";
        }
        console.log(html);
        div.innerHTML = html;
        let elmButton = document.getElementById(`sukilam-button`);
        elmButton.disabled = true;
    })
    .catch(error => {
        console.error(error);
    });
};

function teaching_unit_search(cos_id) {
    console.log(cos_id);
    let div = document.getElementById("teaching_unit_result");
    let sparql = `
      PREFIX textbook: <https://w3id.org/jp-textbook/>
      PREFIX cos: <https://w3id.org/jp-cos/>
      PREFIX schema: <http://schema.org/>
      SELECT * WHERE {
        ?teachingUnit a textbook:TeachingUnit;
          cos:cosItem cos:${cos_id};
          schema:name ?name;
          schema:workExample [
            schema:isPartOf ?textbook;
            schema:pagination ?page
          ].
        ?textbook <http://purl.org/dc/terms/bibliographicCitation> ?textbook_title.
      }`;
    console.log(sparql);
    let url = `https://dydra.com/masao/jp-textbook/sparql?query=${encodeURIComponent(sparql)}&output=json`;
    console.log(url);
    fetch(url, {
        format: "json"
    })
    .then(res => res.json())
    .then(obj => {
        console.log(obj);
        results = obj["results"]["bindings"];
        let html = "<ul>";
        let done = {};
        if (results.length == 0) {
            html = "<p>該当するコンテンツはありません</p>";
        } else {
            results.forEach(element => {
                let url = element["teachingUnit"]["value"];
                let label = element["name"]["value"];
                let textbook_uri = element["textbook"]["value"];
                let textbook_title = element["textbook_title"]["value"];
                let page = element["page"]["value"];
                if (done[textbook_uri]) {
                    html += `<li><a href="${url}">${label}</a> (${textbook_title} ${page})`;
                } else {
                    html += `<li><a href="${url}">${label}</a> (<a href="${textbook_uri}">${textbook_title}</a> ${page})`;
                }
                done[textbook_uri] = true;
            });
            html += "</ul>";
        }
        console.log(html);
        div.innerHTML = html;
        let elmButton = document.getElementById(`textbook-button`);
        elmButton.disabled = true;
  }).catch(error => {
        console.error(error);
    });
};