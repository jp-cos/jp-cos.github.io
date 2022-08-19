function get_nhk4school(cscode, page = 1) {
    /// NHK for School APIにアクセス
    const apiKey = 'fN8GCA4fexdsvVkaWTsAmEqGjuiz8rLq';
    const api = `https://api.nhk.or.jp/school/v1/nfsvideos/cscode/${cscode}?apikey=${apiKey}&page=${page}`;
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
            html += `<h3>NHK for Schoolの動画: ${data['counts']}件中 ${pageStart} - ${pageEnd} 件</h3>`;
            //コンテンツ一覧を表示
            html +=  `<ul class="list-unstyled">`;
            for (let i = 0; i < data['result'].length; i++){
                let seriesTitle = "";
                if (data['result'][i]['url'] && data['result'][i]['about'] && data['result'][i]['about']['nfsSeriesName']) {
                    seriesTitle = ` (${data['result'][i]['about']['nfsSeriesName']})`;
                }
                const result = `
                    <li class="media">
                    <img class="bd-placeholder-img mr-3" width=25% height=25% src="${data['result'][i]['thumbnailUrl']}"></img>
                        <div class="media-body">
                            <h4 class="mt-0 mb-1"><a href="${data['result'][i]['url']}">${data['result'][i]['name']}</a>${seriesTitle}</h4>
                            <p class="mt-0 mb-1">${data['result'][i]['description']}</p>
                        </div>
                    </li>
                `;
                // console.log(result);
                html += result;
            }
            html += '</ul>';
        }
        console.log(data['page'])
        if (data['page'] < data['totalPages']) {
            const nextPage = data['page'] + 1;
            html += `
                <button id="nhk4school-button-${nextPage}" type="button" class="btn btn-nhk4school" onclick="get_nhk4school('8260243111100000', ${nextPage})">
                次の${data['perPage']}件を取得 <i class="bi bi-search"></i>
                </button>
                <div id="nhk4school-list-${nextPage}" />
            `;
        }
        results(html, data['page']);
    };
};
