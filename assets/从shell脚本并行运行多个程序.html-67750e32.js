import{_ as s}from"./plugin-vue_export-helper-c27b6911.js";import{o as n,c as a,a as e}from"./app-9978a549.js";const i={},l=e(`<h2 id="太长不看" tabindex="-1"><a class="header-anchor" href="#太长不看" aria-hidden="true">#</a> 太长不看</h2><blockquote><p>想要并行的程序调用时加<code>&amp;</code>放在后台执行，<code>shell</code>中直接加<code>wait</code>等待子进程执行完成完事儿。</p></blockquote><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token shebang important">#!/bin/bash</span>

command1 <span class="token operator">&amp;</span>
command2 <span class="token operator">&amp;</span>

<span class="token function">wait</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="正文" tabindex="-1"><a class="header-anchor" href="#正文" aria-hidden="true">#</a> 正文</h2><p>本文探讨如何在<code>shell</code>脚本中并行运行多个程序，先从<code>Hello laoli</code>开始，脚本内容如下：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token shebang important">#!/bin/bash</span>

<span class="token builtin class-name">echo</span> <span class="token string">&quot;Hello laoli!&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>运行结果如下：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ ./demo.sh
Hello laoli<span class="token operator">!</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>下面我们定义一个函数：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token shebang important">#!/bin/bash</span>

<span class="token function-name function">run_task</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token builtin class-name">echo</span> <span class="token string">&quot;task is running...&quot;</span>
<span class="token punctuation">}</span>

run_task
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>执行结果如下：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ ./demo.sh
task is running<span class="token punctuation">..</span>.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>脚本瞬间执行完毕，我们让它睡一下，慢一点退出：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token shebang important">#!/bin/bash</span>

<span class="token function-name function">run_task</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token builtin class-name">echo</span> <span class="token string">&quot;<span class="token variable"><span class="token variable">\`</span><span class="token function">date</span> +%s<span class="token variable">\`</span></span> task is running...&quot;</span>
  <span class="token function">sleep</span> <span class="token number">3</span>
  <span class="token builtin class-name">echo</span> <span class="token string">&quot;<span class="token variable"><span class="token variable">\`</span><span class="token function">date</span> +%s<span class="token variable">\`</span></span> task is finished.&quot;</span>
<span class="token punctuation">}</span>

run_task
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>执行结果如下：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ ./demo.sh
<span class="token number">1628945358</span> task is running<span class="token punctuation">..</span>.
<span class="token number">1628945361</span> task is finished.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们打出了时间戳，确认是 3 秒钟后退出。</p><p>修改代码，调用函数两次：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token shebang important">#!/bin/bash</span>

<span class="token function-name function">run_task</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token builtin class-name">echo</span> <span class="token string">&quot;<span class="token variable"><span class="token variable">\`</span><span class="token function">date</span> +%s<span class="token variable">\`</span></span> task<span class="token variable">$1</span> is running...&quot;</span>
  <span class="token function">sleep</span> <span class="token number">3</span>
  <span class="token builtin class-name">echo</span> <span class="token string">&quot;<span class="token variable"><span class="token variable">\`</span><span class="token function">date</span> +%s<span class="token variable">\`</span></span> task<span class="token variable">$1</span> is finished.&quot;</span>
<span class="token punctuation">}</span>

run_task <span class="token number">1</span>
run_task <span class="token number">2</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>$1</code> 表示函数的第一个参数，执行结果如下：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ ./demo.sh
<span class="token number">1628945510</span> task1 is running<span class="token punctuation">..</span>.
<span class="token number">1628945513</span> task1 is finished.
<span class="token number">1628945513</span> task2 is running<span class="token punctuation">..</span>.
<span class="token number">1628945516</span> task2 is finished.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到两次函数调用串行执行，总共执行了 6 秒。</p><p>修改代码，使函数休眠参数指定的时间，并且使函数后台执行，达到并行目的：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token shebang important">#!/bin/bash</span>

<span class="token function-name function">run_task</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token builtin class-name">echo</span> <span class="token string">&quot;<span class="token variable"><span class="token variable">\`</span><span class="token function">date</span> +%s<span class="token variable">\`</span></span> task<span class="token variable">$1</span> is running...&quot;</span>
  <span class="token function">sleep</span> <span class="token variable">$1</span>
  <span class="token builtin class-name">echo</span> <span class="token string">&quot;<span class="token variable"><span class="token variable">\`</span><span class="token function">date</span> +%s<span class="token variable">\`</span></span> task<span class="token variable">$1</span> is finished.&quot;</span>
<span class="token punctuation">}</span>

run_task <span class="token number">1</span> <span class="token operator">&amp;</span>
run_task <span class="token number">2</span> <span class="token operator">&amp;</span>

<span class="token builtin class-name">echo</span> <span class="token string">&quot;Finished&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们知道<code>shell</code>中可以通过<code>command &amp;</code>的方式使<code>command</code>后台执行。同样，<code>shell</code>脚本中也可通过此方式执行函数，其实现方式是<code>shell</code>创建了一个新的进程在后台运行函数。</p><p>执行结果如下：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ ./demo.sh
Finished
$ <span class="token number">1628945846</span> task1 is running<span class="token punctuation">..</span>.
<span class="token number">1628945846</span> task2 is running<span class="token punctuation">..</span>.
<span class="token number">1628945847</span> task1 is finished.
<span class="token number">1628945848</span> task2 is finished.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>此时两个函数调用以子进程的方式在后台运行，所以<code>shell</code>直接打印<code>Finished</code>并退出。之后终端中依次打印出函数中的信息。</p><p>那么如何使主进程等待子进程执行完成后在退出呢？答案是使用<code>wait</code>命令。</p><p><code>wait</code>命令可以使当前<code>shell</code>进程挂起，等待所指定的由当前<code>shell</code>产生的子进程退出后，<code>wait</code>命令才返回。<code>wait</code>命令的参数可以是<code>进程ID</code>或<code>job specification</code>。</p><p>代码如下：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token shebang important">#!/bin/bash</span>

<span class="token function-name function">run_task</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token builtin class-name">echo</span> <span class="token string">&quot;<span class="token variable"><span class="token variable">\`</span><span class="token function">date</span> +%s<span class="token variable">\`</span></span> task<span class="token variable">$1</span> is running...&quot;</span>
  <span class="token function">sleep</span> <span class="token variable">$1</span>
  <span class="token builtin class-name">echo</span> <span class="token string">&quot;<span class="token variable"><span class="token variable">\`</span><span class="token function">date</span> +%s<span class="token variable">\`</span></span> task<span class="token variable">$1</span> is finished.&quot;</span>
<span class="token punctuation">}</span>

run_task <span class="token number">1</span> <span class="token operator">&amp;</span>
run_task <span class="token number">2</span> <span class="token operator">&amp;</span>

<span class="token function">wait</span>
<span class="token builtin class-name">echo</span> <span class="token string">&quot;Finished&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>wait</code>不加参数指等待所有后台进程都运行完毕，执行结果如下：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ ./demo.sh
<span class="token number">1628946797</span> task1 is running<span class="token punctuation">..</span>.
<span class="token number">1628946797</span> task2 is running<span class="token punctuation">..</span>.
<span class="token number">1628946798</span> task1 is finished.
<span class="token number">1628946799</span> task2 is finished.
Finished
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>也可以指定参数，等待指定的进程或任务，代码如下：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token shebang important">#!/bin/bash</span>

<span class="token function-name function">run_task</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token builtin class-name">echo</span> <span class="token string">&quot;<span class="token variable"><span class="token variable">\`</span><span class="token function">date</span> +%s<span class="token variable">\`</span></span> task<span class="token variable">$1</span> is running...&quot;</span>
  <span class="token function">sleep</span> <span class="token variable">$1</span>
  <span class="token builtin class-name">echo</span> <span class="token string">&quot;<span class="token variable"><span class="token variable">\`</span><span class="token function">date</span> +%s<span class="token variable">\`</span></span> task<span class="token variable">$1</span> is finished.&quot;</span>
<span class="token punctuation">}</span>

run_task <span class="token number">1</span> <span class="token operator">&amp;</span>
<span class="token assign-left variable">p1</span><span class="token operator">=</span><span class="token variable">$!</span>
<span class="token builtin class-name">echo</span> <span class="token string">&quot;task1&#39;s pid is <span class="token variable">$p1</span>&quot;</span>

run_task <span class="token number">2</span> <span class="token operator">&amp;</span>
<span class="token assign-left variable">p2</span><span class="token operator">=</span><span class="token variable">$!</span>
<span class="token builtin class-name">echo</span> <span class="token string">&quot;task2&#39;s pid is <span class="token variable">$p2</span>&quot;</span>

<span class="token function">wait</span> <span class="token variable">$p1</span> <span class="token variable">$p2</span>
<span class="token builtin class-name">echo</span> <span class="token string">&quot;Finished&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>内置变量<code>$!</code>记录最后一个被创建的后台进程的<code>pid</code>，执行结果如下：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ ./demo.sh
task1<span class="token string">&#39;s pid is 28303
task2&#39;</span>s pid is <span class="token number">28304</span>
<span class="token number">1628947244</span> task1 is running<span class="token punctuation">..</span>.
<span class="token number">1628947244</span> task2 is running<span class="token punctuation">..</span>.
<span class="token number">1628947245</span> task1 is finished.
<span class="token number">1628947246</span> task2 is finished.
Finished
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>（完）</p>`,39),c=[l];function p(t,d){return n(),a("div",null,c)}const r=s(i,[["render",p],["__file","从shell脚本并行运行多个程序.html.vue"]]);export{r as default};
