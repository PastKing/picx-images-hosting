console.log("\n %c Post-Abstract-AI 开源博客文章摘要AI生成工具 %c https://github.com/zhheo/Post-Abstract-AI \n", "color: #fadfa3; background: #030307; padding:5px 0;", "background: #fadfa3; padding:5px 0;");

function ChucklePostAI(AI_option) {
  var aiExecuted = false;

  function insertAIDiv() {
    removeExistingAIDiv();
    const targetElement = document.querySelector('#article-wrapper > section > #notion-article');
    if (!targetElement) return;

    const aiDiv = document.createElement('div');
    aiDiv.className = 'post-ai';
    aiDiv.innerHTML = `
      <div class="ai-container">
        <div class="ai-header">
          <div class="ai-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path fill="#ffffff" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z" />
            </svg>
          </div>
          <div class="ai-title">AI智能摘要</div>
          <div class="ai-tag">GPT</div>
        </div>
        <div class="ai-content">
          <div class="ai-explanation">生成中...<span class="blinking-cursor"></span></div>
        </div>
      </div>
    `;

    targetElement.insertBefore(aiDiv, targetElement.firstChild);

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
      .post-ai {
        font-family: 'Noto Sans SC', sans-serif;
        margin-bottom: 20px;
      }
      .ai-container {
        background: linear-gradient(135deg, #f9f9f9 0%, #f5f5f5 100%);
        border: 1px solid #e8e8e8;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }
      .ai-header {
        background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
        color: white;
        padding: 12px 20px;
        display: flex;
        align-items: center;
      }
      .ai-icon {
        margin-right: 10px;
      }
      .ai-title {
        font-size: 18px;
        font-weight: bold;
        flex-grow: 1;
      }
      .ai-tag {
        background-color: rgba(255, 255, 255, 0.2);
        padding: 3px 8px;
        border-radius: 12px;
        font-size: 12px;
      }
      .ai-content {
        padding: 20px;
      }
      .ai-explanation {
        font-size: 16px;
        line-height: 1.6;
        color: #333;
      }
      .blinking-cursor {
        display: inline-block;
        width: 2px;
        height: 20px;
        background-color: #333;
        animation: blink 0.7s infinite;
        margin-left: 5px;
      }
      @keyframes blink {
        0% { opacity: 0; }
        50% { opacity: 1; }
        100% { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  function removeExistingAIDiv() {
    const existingAIDiv = document.querySelector(".post-ai");
    if (existingAIDiv) {
      existingAIDiv.parentElement.removeChild(existingAIDiv);
    }
  }

  var chucklePostAI = {
    getTitleAndContent: function() {
      try {
        const title = document.title;
        const container = document.querySelector('#article-wrapper > section > #notion-article');
        if (!container) {
          console.warn('ChucklePostAI：找不到文章容器。');
          return '';
        }
        const paragraphs = container.getElementsByTagName('p');
        const headings = container.querySelectorAll('h1, h2, h3, h4, h5');
        let content = '';

        for (let h of headings) {
          content += h.innerText + ' ';
        }

        for (let p of paragraphs) {
          const filteredText = p.innerText.replace(/https?:\/\/[^\s]+/g, '');
          content += filteredText;
        }

        const combinedText = title + ' ' + content;
        let wordLimit = AI_option.wordLimit || 1000;
        const truncatedText = combinedText.slice(0, wordLimit);
        return truncatedText;
      } catch (e) {
        console.error('ChucklePostAI错误：获取文章内容失败', e);
        return '';
      }
    },

    // fetchAISummary 和 aiShowAnimation 函数保持不变

    // ...

  }

  function runChucklePostAI() {
    if (window.location.pathname.includes('posts')) {
      insertAIDiv();
      const content = chucklePostAI.getTitleAndContent();
      if (content) {
        console.log('ChucklePostAI本次提交的内容为：' + content);
      }
      chucklePostAI.fetchAISummary(content).then(summary => {
        chucklePostAI.aiShowAnimation(summary);
      });
    }
  }

  function initChucklePostAI() {
    if (AI_option.pjax) {
      runChucklePostAI();
      document.addEventListener('pjax:complete', runChucklePostAI);
    } else {
      runChucklePostAI();
    }
  }

  // 初始化时检查URL
  if (window.location.pathname.includes('posts')) {
    initChucklePostAI();
  }

  // 监听URL变化
  let lastUrl = location.href; 
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      if (window.location.pathname.includes('posts')) {
        runChucklePostAI();
      }
    }
  }).observe(document, {subtree: true, childList: true});
}

// 使用示例
ChucklePostAI({
  pjax: true,
  wordLimit: 1000
});
