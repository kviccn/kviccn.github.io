import{_ as n}from"./plugin-vue_export-helper-c27b6911.js";import{o as s,c as a,a as e}from"./app-819cf889.js";const t="/assets/dll-dir-892d3d41.png",o="/assets/create-project-01-60dfb637.png",i="/assets/create-project-02-7f105537.png",p="/assets/create-project-03-d2995eba.png",l="/assets/import-dll-01-9095ded9.png",c="/assets/import-dll-02-ae6b1739.png",r="/assets/import-dll-03-8fd86a5d.jpg",d="/assets/import-dll-04-1949046b.jpg",u="/assets/generate-dll-01-cc6b0798.jpg",g="/assets/transfer-01-e8eb6491.png",m="/assets/transfer-02-cf583028.png",v="/assets/install-01-d42d350c.png",b="/assets/install-02-e81fa467.png",k="/assets/send-3c43a66a.jpg",h="/assets/receive-75641934.png",f="/assets/debug-01-b6b434a9.png",y="/assets/debug-02-a5caf714.jpg",x="/assets/debug-03-41131982.jpg",_="/assets/debug-04-19f2f0af.png",w="/assets/debug-05-2a4bbc2c.png",S="/assets/debug-06-fb444951.png",D="/assets/debug-07-5ade07c6.png",A="/assets/debug-08-11e7e769.png",T="/assets/exchange-toolbox-01-bdfe4924.png",E={},M=e('<p>背景我就不介绍了，能看这篇文章，说明你不是凡人。</p><p>实验环境如下：</p><ul><li>服务器系统：<code>Windows Server 2016 Standard</code></li><li>Exchange 版本：<code>Microsoft Exchange Server 2016</code></li><li>开发环境：<code>Windows 11 Pro + 宇宙第一IDE 👉 Visual Studio 2019</code></li></ul><h2 id="准备" tabindex="-1"><a class="header-anchor" href="#准备" aria-hidden="true">#</a> 准备</h2><p><code>Exchange Transport Agent</code>的开发需要依赖两个<code>dll</code>：</p><ul><li><code>Microsoft.Exchange.Data.Common.dll</code></li><li><code>Microsoft.Exchange.Data.Transport.dll</code></li></ul><p>可从<code>Exchange Server</code>的安装目录中获取，具体位置为<code>C:\\Program Files\\Microsoft\\Exchange Server\\V15\\Public</code>（假设安装在 C 盘）。</p><figure><img src="'+t+'" alt="DLL 位置" tabindex="0" loading="lazy"><figcaption>DLL 位置</figcaption></figure><h2 id="创建项目" tabindex="-1"><a class="header-anchor" href="#创建项目" aria-hidden="true">#</a> 创建项目</h2><p>打开 Visual Studio，按如下步骤创建<code>C#类库</code>项目。</p><p><img src="'+o+'" alt="Step 1" loading="lazy"><img src="'+i+'" alt="Step 2" loading="lazy"></p><p>完成之后你会得到如下项目：</p><figure><img src="'+p+'" alt="Step 3" tabindex="0" loading="lazy"><figcaption>Step 3</figcaption></figure><h2 id="引入依赖" tabindex="-1"><a class="header-anchor" href="#引入依赖" aria-hidden="true">#</a> 引入依赖</h2><p>在刚才创建的解决方案根目录下创建<code>lib</code>目录，存放依赖库。</p><p><img src="'+l+'" alt="Import DLL 1" loading="lazy"><img src="'+c+'" alt="Import DLL 2" loading="lazy"></p><p>依赖库存放的位置没有固定要求，只是这样做会规范一点。</p><p><img src="'+r+'" alt="Import DLL 3" loading="lazy"><img src="'+d+`" alt="Import DLL 4" loading="lazy"></p><p>这样依赖就添加好了。</p><h2 id="编写代码" tabindex="-1"><a class="header-anchor" href="#编写代码" aria-hidden="true">#</a> 编写代码</h2><p>删除默认的源文件<code>Class1.cs</code>，创建源文件<code>MyAgentFactory.cs</code>，或者重命名也行，内容如下：</p><div class="language-csharp line-numbers-mode" data-ext="cs"><pre class="language-csharp"><code><span class="token keyword">using</span> <span class="token namespace">Microsoft<span class="token punctuation">.</span>Exchange<span class="token punctuation">.</span>Data<span class="token punctuation">.</span>Transport</span><span class="token punctuation">;</span>
<span class="token keyword">using</span> <span class="token namespace">Microsoft<span class="token punctuation">.</span>Exchange<span class="token punctuation">.</span>Data<span class="token punctuation">.</span>Transport<span class="token punctuation">.</span>Smtp</span><span class="token punctuation">;</span>

<span class="token keyword">namespace</span> <span class="token namespace">ExchangeEnhance</span>
<span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token keyword">sealed</span> <span class="token keyword">class</span> <span class="token class-name">MyAgentFactory</span> <span class="token punctuation">:</span> <span class="token type-list"><span class="token class-name">SmtpReceiveAgentFactory</span></span>
    <span class="token punctuation">{</span>
        <span class="token keyword">public</span> <span class="token keyword">override</span> <span class="token return-type class-name">SmtpReceiveAgent</span> <span class="token function">CreateAgent</span><span class="token punctuation">(</span><span class="token class-name">SmtpServer</span> server<span class="token punctuation">)</span>
        <span class="token punctuation">{</span>
            <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token constructor-invocation class-name">MyAgent</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">MyAgent</span> <span class="token punctuation">:</span> <span class="token type-list"><span class="token class-name">SmtpReceiveAgent</span></span>
    <span class="token punctuation">{</span>
        <span class="token keyword">public</span> <span class="token function">MyAgent</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token punctuation">{</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>OnEndOfData <span class="token operator">+=</span> <span class="token keyword">new</span> <span class="token constructor-invocation class-name">EndOfDataEventHandler</span><span class="token punctuation">(</span>MyEndOfDataHandler<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token keyword">private</span> <span class="token return-type class-name"><span class="token keyword">void</span></span> <span class="token function">MyEndOfDataHandler</span><span class="token punctuation">(</span><span class="token class-name">ReceiveMessageEventSource</span> source<span class="token punctuation">,</span> <span class="token class-name">EndOfDataEventArgs</span> e<span class="token punctuation">)</span>
        <span class="token punctuation">{</span>
            e<span class="token punctuation">.</span>MailItem<span class="token punctuation">.</span>Message<span class="token punctuation">.</span>Subject <span class="token operator">+=</span> <span class="token string">&quot; - 我在标题里动了手脚！&quot;</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们的传输代理只做了一件事，就是在邮件的标题里动了手脚。（本文只讲开发流程，不关注代码细节，况且代码很简单，没什么要讲的）</p><h2 id="生成-dll" tabindex="-1"><a class="header-anchor" href="#生成-dll" aria-hidden="true">#</a> 生成 DLL</h2><figure><img src="`+u+'" alt="Generate DLL 1" tabindex="0" loading="lazy"><figcaption>Generate DLL 1</figcaption></figure><p>这里我们选择生成用于<code>debug</code>的 DLL。</p><h2 id="安装传输代理" tabindex="-1"><a class="header-anchor" href="#安装传输代理" aria-hidden="true">#</a> 安装传输代理</h2><h3 id="复制-dll-到目标机器" tabindex="-1"><a class="header-anchor" href="#复制-dll-到目标机器" aria-hidden="true">#</a> 复制 DLL 到目标机器</h3><p>将生成的<code>DLL</code>及调试文件复制到<code>Exchange Server</code>。</p><p>开发环境下生成的文件： <img src="'+g+'" alt="Transfer 1" loading="lazy"></p><p>复制到<code>Exchange Server</code>后的文件： <img src="'+m+'" alt="Transfer 2" loading="lazy"></p><p>这里我在 C 盘根目录下创建了文件夹<code>myagents</code>，并将文件放在了该文件夹下。（理论上讲文件位置应该是没有限制的，但是当我把文件放在桌面的时候程序无法正常运行）</p><h3 id="安装传输代理并启用" tabindex="-1"><a class="header-anchor" href="#安装传输代理并启用" aria-hidden="true">#</a> 安装传输代理并启用</h3><p>安装传输代理需要使用<code>Exchange</code>提供的命令行管理程序及命令。注意，不是普通的<code>PowerShell</code>。</p><p><img src="'+v+'" alt="Install 01" loading="lazy"><img src="'+b+`" alt="Install 02" loading="lazy"></p><p>查看默认的传输代理：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code><span class="token namespace">[PS]</span> C:\\Windows\\system32&gt;<span class="token function">Get-TransportAgent</span>

Identity                                           Enabled         Priority
<span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span>                                           <span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">-</span>         <span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span>
Transport Rule Agent                               True            1
DLP Policy Agent                                   True            2
Retention Policy Agent                             True            3
Supervisory Review Agent                           True            4
Malware Agent                                      True            5
Text Messaging Routing Agent                       True            6
Text Messaging Delivery Agent                      True            7
System Probe Drop Smtp Agent                       True            8
System Probe Drop Routing Agent                    True            9
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>安装传输代理：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code><span class="token namespace">[PS]</span> C:\\Windows\\system32&gt;<span class="token function">Install-TransportAgent</span> <span class="token operator">-</span>Name <span class="token string">&quot;MyAgent&quot;</span> <span class="token operator">-</span>TransportAgentFactory <span class="token string">&quot;ExchangeEnhance.MyAgentFactory&quot;</span> <span class="token operator">-</span>AssemblyPath <span class="token string">&quot;C:\\myagents\\ExchangeEnhance.dll&quot;</span>

Identity                                           Enabled         Priority
<span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span>                                           <span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">-</span>         <span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span>
MyAgent                                            False           10
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>设置优先级：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code><span class="token namespace">[PS]</span> C:\\Windows\\system32&gt;<span class="token function">Set-TransportAgent</span> MyAgent <span class="token operator">-</span>Priority 2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>启用传输代理：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code><span class="token namespace">[PS]</span> C:\\Windows\\system32&gt;<span class="token function">Enable-TransportAgent</span> MyAgent
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>重启服务：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code><span class="token namespace">[PS]</span> C:\\Windows\\system32&gt;<span class="token function">Restart-Service</span> MSExchangeTransport
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>重启 IIS：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code><span class="token namespace">[PS]</span> C:\\Windows\\system32&gt;iisreset
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>重启 IIS 又是一个玄学问题，有时候传输代理需要在 IIS 重启后才能生效。</p><p>查看传输代理的安装情况：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code><span class="token namespace">[PS]</span> C:\\Windows\\system32&gt;<span class="token function">Get-TransportAgent</span>

Identity                                           Enabled         Priority
<span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span>                                           <span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">-</span>         <span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span>
Transport Rule Agent                               True            1
MyAgent                                            True            2
DLP Policy Agent                                   True            3
Retention Policy Agent                             True            4
Supervisory Review Agent                           True            5
Malware Agent                                      True            6
Text Messaging Routing Agent                       True            7
Text Messaging Delivery Agent                      True            8
System Probe Drop Smtp Agent                       True            9
System Probe Drop Routing Agent                    True            10
</code></pre><div class="highlight-lines"><br><br><br><br><br><div class="highlight-line"> </div><br><br><br><br><br><br><br><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="测试传输代理是否生效" tabindex="-1"><a class="header-anchor" href="#测试传输代理是否生效" aria-hidden="true">#</a> 测试传输代理是否生效</h2><p>先发一封邮件：</p><figure><img src="`+k+'" alt="Send" tabindex="0" loading="lazy"><figcaption>Send</figcaption></figure><p>查看接收到的邮件：</p><figure><img src="'+h+'" alt="Receive" tabindex="0" loading="lazy"><figcaption>Receive</figcaption></figure><p>ok，成功！</p><h2 id="调试" tabindex="-1"><a class="header-anchor" href="#调试" aria-hidden="true">#</a> 调试</h2><p>因为<code>DLL</code>是加载到<code>Exchange Server</code>中运行的，所以需要远程调试。</p><ol><li><p>在<code>Exchange Server</code>上安装<code>Visual Studio 远程调试工具</code>，版本需要与 IDE 的版本相同，另外还需要注意对应的处理器架构。这里使用的是<code>Visual Studio 2019 远程工具 x64</code></p></li><li><p>以<code>管理员</code>身份运行<code>Visual Studio 2019 远程调试器</code></p></li></ol><figure><img src="'+f+'" alt="Debug 1" tabindex="0" loading="lazy"><figcaption>Debug 1</figcaption></figure><ol start="3"><li>在<code>Visual Studio</code>菜单栏中选择<code>调试-&gt;附加到进程</code></li></ol><figure><img src="'+y+'" alt="Debug 2" tabindex="0" loading="lazy"><figcaption>Debug 2</figcaption></figure><ol start="4"><li>选择目标服务器</li></ol><figure><img src="'+x+'" alt="Debug 3" tabindex="0" loading="lazy"><figcaption>Debug 3</figcaption></figure><ol start="5"><li>选择要附加到的进程<code>EdgeTransport.exe</code>，注意要勾选“显示所有用户的进程”，点击“附加”按钮完成选择</li></ol><figure><img src="'+_+'" alt="Debug 4" tabindex="0" loading="lazy"><figcaption>Debug 4</figcaption></figure><ol start="6"><li>打个断点</li></ol><figure><img src="'+w+'" alt="Debug 5" tabindex="0" loading="lazy"><figcaption>Debug 5</figcaption></figure><ol start="7"><li>发一封邮件</li></ol><figure><img src="'+S+'" alt="Debug 6" tabindex="0" loading="lazy"><figcaption>Debug 6</figcaption></figure><ol start="8"><li>点击发送后程序执行到断点处，我们在标题中增加“远程调试”几个字，完成后点击“继续”</li></ol><figure><img src="'+D+'" alt="Debug 7" tabindex="0" loading="lazy"><figcaption>Debug 7</figcaption></figure><ol start="9"><li>接收邮件，验证调试</li></ol><figure><img src="'+A+'" alt="Debug 8" tabindex="0" loading="lazy"><figcaption>Debug 8</figcaption></figure><h2 id="其他" tabindex="-1"><a class="header-anchor" href="#其他" aria-hidden="true">#</a> 其他</h2><p>最后跟大家介绍一个工具，<code>Exchange</code>提供的工具箱<code>Exchange Toolbox</code>。其中的<code>Queue Viewer</code>可以跟踪到邮件的当前状态，调试的时候可以用得到。</p><figure><img src="'+T+'" alt="Exchange Toolbox" tabindex="0" loading="lazy"><figcaption>Exchange Toolbox</figcaption></figure><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结" aria-hidden="true">#</a> 总结</h2><p><code>Exchange 传输代理</code>的开发是一件玄而又玄的事情，不是说代码有多难写，而是你不知道会在哪个莫名其妙的地方卡住，然后不知道做了什么就又成功了。所以最重要的是保持信心，坚信自己能解决每一个玄学问题，祝好运！</p>',79),L=[M];function P(z,I){return s(),a("div",null,L)}const j=n(E,[["render",P],["__file","exchange-transport-agents-development-guide.html.vue"]]);export{j as default};