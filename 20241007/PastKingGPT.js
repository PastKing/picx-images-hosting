console.log("\n %c Post-Abstract-AI 开源博客文章摘要AI生成工具 %c https://github.com/zhheo/Post-Abstract-AI \n", "color: #fadfa3; background: #030307; padding:5px 0;", "background: #fadfa3; padding:5px 0;")

function ChucklePostAI(AI_option) {
  var aiExecuted = false;

  function insertAIDiv(selector) {
    removeExistingAIDiv();
    const targetElement = document.querySelector(selector);
    if (!targetElement) return;

    const aiDiv = document.createElement('div');
    aiDiv.className = 'post-ai';
    aiDiv.innerHTML = `
      <div class="ai-title">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="21px" height="21px" viewBox="0 0 48 48">
          <title>机器人</title>
          <g id="&#x673A;&#x5668;&#x4EBA;" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <path d="M34.717885,5.03561087 C36.12744,5.27055371 37.079755,6.60373651 36.84481,8.0132786 L35.7944,14.3153359 L38.375,14.3153359 C43.138415,14.3153359 47,18.1768855 47,22.9402569 L47,34.4401516 C47,39.203523 43.138415,43.0650727 38.375,43.0650727 L9.625,43.0650727 C4.861585,43.0650727 1,39.203523 1,34.4401516 L1,22.9402569 C1,18.1768855 4.861585,14.3153359 9.625,14.3153359 L12.2056,14.3153359 L11.15519,8.0132786 C10.920245,6.60373651 11.87256,5.27055371 13.282115,5.03561087 C14.69167,4.80066802 16.024865,5.7529743 16.25981,7.16251639 L17.40981,14.0624532 C17.423955,14.1470924 17.43373,14.2315017 17.43948,14.3153359 L30.56052,14.3153359 C30.56627,14.2313867 30.576045,14.1470924 30.59019,14.0624532 L31.74019,7.16251639 C31.975135,5.7529743 33.30833,4.80066802 34.717885,5.03561087 Z M38.375,19.4902885 L9.625,19.4902885 C7.719565,19.4902885 6.175,21.0348394 6.175,22.9402569 L6.175,34.4401516 C6.175,36.3455692 7.719565,37.89012 9.625,37.89012 L38.375,37.89012 C40.280435,37.89012 41.825,36.3455692 41.825,34.4401516 L41.825,22.9402569 C41.825,21.0348394 40.280435,19.4902885 38.375,19.4902885 Z M14.8575,23.802749 C16.28649,23.802749 17.445,24.9612484 17.445,26.3902253 L17.445,28.6902043 C17.445,30.1191812 16.28649,31.2776806 14.8575,31.2776806 C13.42851,31.2776806 12.27,30.1191812 12.27,28.6902043 L12.27,26.3902253 C12.27,24.9612484 13.42851,23.802749 14.8575,23.802749 Z M33.1425,23.802749 C34.57149,23.802749 35.73,24.9612484 35.73,26.3902253 L35.73,28.6902043 C35.73,30.1191812 34.57149,31.2776806 33.1425,31.2776806 C31.71351,31.2776806 30.555,30.1191812 30.555,28.6902043 L30.555,26.3902253 C30.555,24.9612484 31.71351,23.802749 33.1425,23.802749 Z" id="&#x5F62;&#x72B6;&#x7ED3;&#x5408;" fill="#444444" fill-rule="nonzero"></path>
          </g>
        </svg>
        <div class="ai-title-text">AI摘要</div>
        <div class="ai-tag">GPT</div>
      </div>
      <div class="ai-explanation">生成中...<span class="blinking-cursor"></span></div>
    `;

    targetElement.insertBefore(aiDiv, targetElement.firstChild);
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
        const container = document.querySelector('#notion-article');
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

    fetchAISummary: async function(content) {
      const url = window.location.href;
      const title = document.title;
      
      try {
        const response = await fetch('https://aizhaiyao.pastking.xyz/api/summary/?token=apastkingplus', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: content
          })
        });

        if (response.ok) {
          const data = await response.json();
          return data.summary;
        } else {
          throw new Error('Response not ok');
        }
      } catch (error) {
        console.error('ChucklePostAI：请求失败', error);
        return '获取文章摘要失败，请稍后再试。';
      }
    },

    aiShowAnimation: function(text) {
      const element = document.querySelector(".ai-explanation");
      if (!element) return;

      if (aiExecuted) return;

      aiExecuted = true;
      const typingDelay = 25;
      const punctuationDelayMultiplier = 6;

      element.innerHTML = "生成中..." + '<span class="blinking-cursor"></span>';

      let animationRunning = true;
      let currentIndex = 0;
      let lastUpdateTime = performance.now();

      const animate = () => {
        if (currentIndex < text.length && animationRunning) {
          const currentTime = performance.now();
          const timeDiff = currentTime - lastUpdateTime;

          const letter = text.slice(currentIndex, currentIndex + 1);
          const isPunctuation = /[，。！、？,.!?]/.test(letter);
          const delay = isPunctuation ? typingDelay * punctuationDelayMultiplier : typingDelay;

          if (timeDiff >= delay) {
            element.innerText = text.slice(0, currentIndex + 1);
            lastUpdateTime = currentTime;
            currentIndex++;

            if (currentIndex < text.length) {
              element.innerHTML = text.slice(0, currentIndex) + '<span class="blinking-cursor"></span>';
            } else {
              element.innerHTML = text;
              aiExecuted = false;
              observer.disconnect();
            }
          }
          requestAnimationFrame(animate);
        }
      }

      const observer = new IntersectionObserver((entries) => {
        let isVisible = entries[0].isIntersecting;
        animationRunning = isVisible;
        if (animationRunning && currentIndex === 0) {
          setTimeout(() => {
            requestAnimationFrame(animate);
          }, 200);
        }
      }, { threshold: 0 });

      let post_ai = document.querySelector('.post-ai');
      observer.observe(post_ai);
    },
  }

  function runChucklePostAI() {
    insertAIDiv('#notion-article');
    const content = chucklePostAI.getTitleAndContent();
    if (content) {
      console.log('ChucklePostAI本次提交的内容为：' + content);
    }
    chucklePostAI.fetchAISummary(content).then(summary => {
      chucklePostAI.aiShowAnimation(summary);
    });
  }

  if (AI_option.pjax) {
    runChucklePostAI();
    document.addEventListener('pjax:complete', runChucklePostAI);
  } else {
    document.addEventListener("DOMContentLoaded", runChucklePostAI);
  }
}

// 使用示例
ChucklePostAI({
  pjax: true,
  wordLimit: 1000
});
