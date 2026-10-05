const STORAGE_KEY = 'chatbucket:local-data:v2';

const now = () => new Date().toISOString();
const id = () => (globalThis.crypto?.randomUUID?.().replaceAll('-', '') || `${Date.now()}${Math.random()}`.replace('.', '')).slice(0, 24);
const copy = value => JSON.parse(JSON.stringify(value));

function makeRecord(kind, title, status, data = {}) {
  const timestamp = now();
  return { _id:id(), organizationId:'acme-support', kind, title, status, data, createdAt:timestamp, updatedAt:timestamp };
}

function makeAgent(name, purpose, role, languages, status, voice = 'Aarav') {
  const timestamp = now();
  return {
    _id:id(), organizationId:'acme-support', name, purpose, role, company:'Acme Support',
    instructions:`Help with ${purpose.toLowerCase()}. Escalate unresolved issues.`, languages,
    fallbackLanguage:languages[0], detectCallerLanguage:true, voice, speakingSpeed:'Natural',
    knowledgeSources:[{ _id:id(), label:'Installation FAQ', kind:'faq', content:'To install the widget, copy your publish code to your website before the closing body tag.', status:'ready' }],
    actions:{ accountLookup:false, supportTicket:false }, greeting:'Welcome to Acme Support. How can I help you today?',
    style:'Concise and helpful', unanswered:'Ask to connect with a person', endOfCall:'Summarize the outcome',
    silenceSeconds:8, maxCallMinutes:15, confirmTicket:true, status, createdAt:timestamp, updatedAt:timestamp
  };
}

function blankWorkflow(name, agentId) {
  const start=id(), conversation=id(), end=id();
  return {
    name, trigger:'inbound',
    nodes:[
      { id:start, type:'start', x:80, y:170, config:{} },
      { id:conversation, type:'conversation', x:390, y:170, config:{ agentId, prompt:'How can I help you today?', toolIds:[] } },
      { id:end, type:'end', x:700, y:170, config:{ message:'Thank you for calling.' } }
    ],
    edges:[{ id:id(), source:start, target:conversation, label:'next' },{ id:id(), source:conversation, target:end, label:'next' }]
  };
}

function seed() {
  const agents = [
    makeAgent('Website Support','Customer support','Customer support',['English (India)','Hindi','Telugu'],'ready'),
    makeAgent('Sales Concierge','Sales enquiries','Sales enquiries',['English (India)','Telugu'],'ready','Maya'),
    makeAgent('Booking Assistant','Appointment scheduling','Appointment scheduling',['English (India)'],'draft')
  ];
  const workflow = makeRecord('workflow','Website support flow','draft');
  workflow.data={ draft:blankWorkflow(workflow.title,agents[0]._id), versions:[], revision:1 };
  const salesWorkflow = makeRecord('workflow','Sales qualification and handoff','published');
  const salesDraft=blankWorkflow(salesWorkflow.title,agents[1]._id);salesDraft.trigger='outbound';
  salesWorkflow.data={draft:salesDraft,versions:[{number:1,publishedAt:now(),draft:copy(salesDraft)}],revision:2};
  const widget = makeRecord('widget','Acme Voice Widget','published',{
    screen_7:{'Widget name':'Acme Voice Widget','Voice agent':'Website Support'},
    screen_8:{'Widget name':'Acme Voice Widget','Accent color':'#7145e7','Position':'Bottom right','Button label':'Talk to support','Launcher shape':'Pill'},
    screen_9:{'Welcome message':'Hi! How can Acme Support help today?','Ask for caller name':true,'Ask for email':true,'Ask for phone number':false,'Privacy notice URL':'https://acme.example/privacy'},
    screen_10:{'Enable human support':true,'Department':'Technical Support','Ring duration (seconds)':'30','After wait expires':'Offer callback'},
    screen_11:{'Allowed website URL':'https://acme.example','Time zone':'Asia/Kolkata','Open from':'09:00','Open until':'18:00','After-hours behavior':'AI continues answering','When agents are unavailable':'Offer callback'},
    screen_12:{'Widget name':'Acme Voice Widget','Allowed website URL':'https://acme.example'},
    security:{agentId:agents[0]._id,sessionMinutes:15,revision:1,domains:[{id:id(),origin:'https://acme.example',status:'verified',verifiedAt:now(),challenge:'demo-verification',recordName:'_chatbucket.acme.example'}]}
  });
  const salesWidget=makeRecord('widget','Sales Voice Concierge','draft',{screen_7:{'Widget name':'Sales Voice Concierge','Voice agent':'Sales Concierge'},screen_8:{'Widget name':'Sales Voice Concierge','Accent color':'#17a67a','Position':'Bottom left','Button label':'Talk to sales','Launcher shape':'Round'},security:{agentId:agents[1]._id,sessionMinutes:20,revision:1,domains:[{id:id(),origin:'https://sales.acme.example',status:'pending',challenge:'sales-demo-verification',recordName:'_chatbucket.sales.acme.example',createdAt:now()}]}});
  const reservedNumber=makeRecord('phone-number','+91 80 40XX 0101','reserved',{catalogId:'blr-101',region:'Bengaluru',area:'080',display:'+91 80 40XX 0101',revision:1,demoOnly:true,routing:{agentId:agents[0]._id,timezone:'Asia/Kolkata',start:'09:00',end:'18:00',days:['Mon','Tue','Wed','Thu','Fri'],afterHours:'callback'}});
  const secondNumber=makeRecord('phone-number','+91 40 40XX 0201','reserved',{catalogId:'hyd-201',region:'Hyderabad',area:'040',display:'+91 40 40XX 0201',revision:1,demoOnly:true,routing:{agentId:agents[1]._id,timezone:'Asia/Kolkata',start:'10:00',end:'19:00',days:['Mon','Tue','Wed','Thu','Fri','Sat'],afterHours:'end'}});
  const inboundRoute=makeRecord('inbound-route','Main support line','draft',{source:'demo-number',numberLabel:reservedNumber.title,numberId:reservedNumber._id,revision:1,config:{agentId:agents[0]._id,timezone:'Asia/Kolkata',days:['Mon','Tue','Wed','Thu','Fri'],start:'09:00',end:'18:00',closedDates:['2026-10-02'],afterHours:'callback',afterHoursMessage:'Our team is offline. Please leave a callback request.'},providerConnected:false,forwardingVerified:false});
  return { agents, records:[
    makeRecord('team-member','Priya Sharma','active',{email:'agent@demo.chatbucket',role:'agent',department:'Customer support',availability:{timezone:'Asia/Kolkata',days:['Mon','Tue','Wed','Thu','Fri'],start:'09:00',end:'18:00',paused:false},revision:1,inviteDelivered:true}),
    makeRecord('team-member','Arjun Nair','active',{email:'arjun@acme.example',role:'supervisor',department:'Technical Support',availability:{timezone:'Asia/Kolkata',days:['Mon','Tue','Wed','Thu','Fri'],start:'10:00',end:'19:00',paused:false},revision:1,inviteDelivered:true}),
    makeRecord('team-member','Meera Iyer','invited',{email:'meera@acme.example',role:'viewer',department:'Sales',availability:{timezone:'Asia/Kolkata',days:['Mon','Tue','Wed','Thu','Fri'],start:'09:30',end:'17:30',paused:true},revision:1,inviteDelivered:false}),
    makeRecord('merchant-profile','Acme Support','ready',{companyName:'Acme Support',supportEmail:'support@acme.example',timezone:'Asia/Kolkata',revision:1}),
    widget,
    salesWidget,
    makeRecord('call','Rahul Sharma','waiting',{screen_14:{'Caller name':'Rahul Sharma','Issue summary':'WordPress widget is not loading','Department':'Technical Support'},screen_16:{'Takeover note':'Customer has already cleared the browser cache.'},screen_23:{'Internal note':'Check the WordPress plugin version before joining.'},transcript:[{speaker:'Caller',text:'The voice widget is not loading on our WordPress site.',at:now()},{speaker:'AI',text:'I can help with your WordPress widget. Would you like a support specialist?',at:now()}],aiSummary:'Widget fails to load after a theme update. Caller requested technical support.',phone:'+919876540010',source:'web',widgetId:widget._id}),
    makeRecord('call','Pooja Verma','waiting',{screen_14:{'Caller name':'Pooja Verma','Issue summary':'Cannot log in to my account','Department':'Customer Support'},transcript:[{speaker:'Caller',text:'Please connect me to a person.',at:now()},{speaker:'AI',text:'I have notified the customer support team.',at:now()}],aiSummary:'Account login issue after password reset.',phone:'+919876540011',source:'web',widgetId:widget._id}),
    makeRecord('call','Neha Patel','human',{screen_14:{'Caller name':'Neha Patel','Issue summary':'Pricing question for a team','Department':'Sales'},screen_24:{'Private team note':'Interested in the annual business plan.'},transcript:[{speaker:'AI',text:'I will connect you with Priya Sharma.',at:now()},{speaker:'Agent',text:'Hi Neha, I can explain the team plans.',at:now()}],aiSummary:'Prospect needs pricing for a 20-person support team.',assignedAgent:'Priya Sharma',phone:'+919876540012',source:'web'}),
    makeRecord('call','Vikram Rao','transfer-pending',{screen_14:{'Caller name':'Vikram Rao','Issue summary':'Needs billing specialist','Department':'Customer Support'},screen_25:{'Transfer to department':'Sales','Transfer to agent':'Arjun Nair','Reason for transfer':'Annual invoice and tax details'},transcript:[{speaker:'Agent',text:'I am transferring you to our billing specialist.',at:now()}],assignedAgent:'Priya Sharma',source:'phone'}),
    makeRecord('call','Sana Khan','follow-up',{screen_14:{'Caller name':'Sana Khan','Issue summary':'Webhook delivery delay','Department':'Technical Support'},screen_27:{Outcome:'Follow-up needed',Summary:'Engineering logs requested','Follow-up time':'2026-09-28T11:00'},outcome:'Follow-up needed',assignedAgent:'Arjun Nair',source:'web'}),
    makeRecord('call','Amit Mehta','ended',{screen_14:{'Caller name':'Amit Mehta','Issue summary':'Webhook integration support','Department':'Technical Support'},screen_27:{Outcome:'Resolved',Summary:'Corrected webhook signing secret'},transcript:[{speaker:'Caller',text:'Our webhook signature is rejected.',at:now()},{speaker:'Agent',text:'The signing secret was outdated. It is working now.',at:now()}],outcome:'Resolved',assignedAgent:'Priya Sharma',source:'phone'}),
    makeRecord('call','Divya Shah','ended',{screen_14:{'Caller name':'Divya Shah','Issue summary':'Appointment rescheduling','Department':'Customer Support'},screen_27:{Outcome:'Resolved',Summary:'Appointment moved to Friday'},outcome:'Resolved',source:'web'}),
    makeRecord('campaign','September Renewal Outreach','scheduled',{screen_44:{'Campaign name':'September Renewal Outreach','Voice agent':'Sales Concierge'},screen_45:{'Contacts (one phone per line)':'+919876543210\n+919876543211\n+919876543212','Consent source':'Renewal opt-in'},screen_46:{'Verified caller number':'+918040001001','Concurrent campaign calls':'5'},screen_47:{'Start date and time':'2026-09-25T10:00','Time zone':'Asia/Kolkata'},stats:{eligible:3,initiated:0,connected:0,completed:0,queued:3}}),
    makeRecord('campaign','Trial onboarding','running',{screen_44:{'Campaign name':'Trial onboarding','Voice agent':'Sales Concierge','Purpose':'Help new trial users complete setup'},screen_45:{'Contacts (one phone per line)':'+919876540101\n+919876540102\n+919876540103\n+919876540104','Consent source':'Product trial opt-in'},screen_46:{'Verified caller number':'+918040001001','Concurrent campaign calls':'3','Reserved inbound slots':'2','Calls per second':'1'},screen_47:{'Start date and time':'2026-09-26T09:30','End date and time':'2026-09-26T17:30','Time zone':'Asia/Kolkata','Maximum retries':'2','Voicemail action':'Hang up'},stats:{eligible:40,initiated:26,connected:19,completed:14,queued:14}}),
    makeRecord('campaign','October product update','draft',{screen_44:{'Campaign name':'October product update','Voice agent':'Sales Concierge','Purpose':'Introduce the new analytics dashboard'},stats:{eligible:0,initiated:0,connected:0,completed:0,queued:0}}),
    makeRecord('campaign','Welcome Follow-ups','completed',{screen_44:{'Campaign name':'Welcome Follow-ups','Voice agent':'Website Support','Purpose':'Check whether onboarding questions were resolved'},stats:{eligible:55,initiated:55,connected:39,completed:34,queued:0}}),
    makeRecord('callback','Karan Malhotra','requested',{screen_32:{'Your name':'Karan Malhotra','Phone number':'+919876540001','How can we help?':'Website voice widget issue'}}),
    makeRecord('callback','Ananya Bose','assigned',{screen_18:{'Customer name':'Ananya Bose','Phone number':'+919876540002','Reason':'Needs help choosing a plan','Preferred time':'2026-09-27T14:30'},assignedAgent:'Priya Sharma'}),
    makeRecord('callback','Rohit Das','completed',{screen_18:{'Customer name':'Rohit Das','Phone number':'+919876540003','Reason':'Invoice copy requested','Preferred time':'2026-09-24T12:00'},outcome:'Invoice emailed'}),
    makeRecord('rating','Priya Kapoor','submitted',{screen_33:{Rating:'5','Your feedback':'Clear response and helpful agent.'}}),
    makeRecord('rating','Rahul Desai','submitted',{screen_33:{Rating:'4','Your feedback':'Quick answer.'}}),
    makeRecord('rating','Lakshmi Menon','submitted',{screen_33:{Rating:'5','Your feedback':'The handoff to a person was seamless.'}}),
    makeRecord('rating','Kabir Singh','submitted',{screen_33:{Rating:'3','Your feedback':'Useful answer, but the wait was longer than expected.'}}),
    makeRecord('phone-route','Acme Inbound','active',{screen_40:{'Business phone number':'+91804000XXXX','Agent':'Website Support'}}),
    makeRecord('phone-route','Sales Inbound','draft',{screen_40:{'Business phone number':'+91404000XXXX','Agent':'Sales Concierge','Business hours':'10:00-19:00','After-hours behavior':'Offer callback','Human handoff department':'Sales'}}),
    makeRecord('agent','Website Support settings','ready',{screen_34:{'Voice agent':'Website Support','Agent instructions':'Answer setup and account questions clearly.','System prompt':'Use the configured FAQ and offer human support when needed.','Variables':'customer_name, plan'},screen_35:{'Voice agent':'Website Support','Website URL':'https://acme.example/help','FAQ question':'How do I install the widget?','FAQ answer':'Paste the script before the closing body tag.','Demo source excerpt':'Installation and troubleshooting guide.'},screen_36:{'Voice agent':'Website Support','Account lookup':true,'Ticket creation':true,'Endpoint URL':'https://api.acme.example/support','Require confirmation':true},screen_37:{'Voice agent':'Website Support','Speaking speed':'Natural','Allow caller interruptions':true,'Silence prompt (seconds)':'8','Fallback language':'English (India)'},screen_38:{'Voice agent':'Website Support','Collect caller consent':true,'Save transcript':true,'Save recording':false,'Outcome categories':'Resolved, Follow-up needed, Transferred'},screen_39:{'Voice agent':'Website Support','Version note':'Improved handoff instructions'}}),
    workflow,
    salesWorkflow,
    makeRecord('tool','Current date and time','ready',{type:'datetime',config:{timezone:'Asia/Kolkata',format:'date-and-time'},revision:1}),
    makeRecord('tool','Create support request','ready',{type:'api',config:{url:'https://api.acme.example/support',method:'POST',timeout:15,requestBody:'{"summary":"{{call_summary}}"}'},revision:1}),
    makeRecord('tool','Transfer to Sales Concierge','ready',{type:'transfer',config:{targetAgentId:agents[1]._id,summaryTemplate:'Customer is interested in pricing and plans.'},revision:1}),
    makeRecord('tool','Human support handoff','draft',{type:'handoff',config:{department:'Technical Support',reason:'The AI could not resolve the request.',fallback:'callback'},revision:1}),
    makeRecord('tool','End resolved call','ready',{type:'hangup',config:{closingMessage:'Thank you for calling Acme Support. Have a great day.'},revision:1}),
    reservedNumber,
    secondNumber,
    inboundRoute,
    makeRecord('inbound-route','Sales line','draft',{source:'demo-number',numberLabel:secondNumber.title,numberId:secondNumber._id,revision:1,config:{agentId:agents[1]._id,timezone:'Asia/Kolkata',days:['Mon','Tue','Wed','Thu','Fri','Sat'],start:'10:00',end:'19:00',closedDates:[],afterHours:'end',afterHoursMessage:'Sales is currently closed. Please visit our website.'},providerConnected:false,forwardingVerified:false})
  ]};
}

function load() {
  try {
    const stored=JSON.parse(localStorage.getItem(STORAGE_KEY));
    if(stored)return stored;
    const initial=seed();
    localStorage.setItem(STORAGE_KEY,JSON.stringify(initial));
    return initial;
  }
  catch { return seed(); }
}
function save(state) { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function json(value, status = 200) { return new Response(JSON.stringify(value), { status, headers:{'Content-Type':'application/json'} }); }
function body(options) { try { return options?.body ? JSON.parse(options.body) : {}; } catch { return {}; } }
function routeOf(input) { try { return new URL(input, window.location.origin).pathname; } catch { return input; } }
function queryOf(input) { try { return new URL(input, window.location.origin).searchParams; } catch { return new URLSearchParams(); } }
function updateRecord(state, record, patch) {
  if (patch.title !== undefined) record.title=String(patch.title).trim();
  if (patch.status !== undefined) record.status=patch.status;
  if (patch.data && typeof patch.data==='object') record.data={...record.data,...patch.data};
  record.updatedAt=now(); save(state); return record;
}
function collectionRoute(state, route, method, input, root, kind, createData = undefined) {
  if (route===root && method==='GET') return json(state.records.filter(row=>row.kind===kind).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt)));
  if (route===root && method==='POST') {
    const title=String(input.name||input.title||'Untitled').trim();
    const record=makeRecord(kind,title,'draft',createData?.(input)||input.data||{});state.records.unshift(record);save(state);return json(record,201);
  }
  const match=route.match(new RegExp(`^${root}/([^/]+)$`));
  if (!match) return null;
  const record=state.records.find(row=>row.kind===kind&&row._id===match[1]);
  if (!record) return json({error:'Not found.'},404);
  if (method==='GET') return json(record);
  if (method==='PUT'||method==='PATCH') return json(updateRecord(state,record,{title:input.name||input.title,data:input.config?{...record.data,config:input.config,revision:(record.data.revision||0)+1}:input.data,status:input.status}));
  return null;
}

export async function localApiFetch(input: string, options: RequestInit = {}) {
  const state=load(), route=routeOf(input), method=(options.method||'GET').toUpperCase(), inputBody=body(options);

  if (route==='/api/health') return json({status:'ok',mode:'browser-local',database:true,cache:true});
  if (route==='/api/voice-agents'&&method==='GET') return json(state.agents);
  if (route==='/api/voice-agents'&&method==='POST') { const agent={...copy(inputBody),_id:id(),organizationId:'acme-support',status:'draft',createdAt:now(),updatedAt:now()};state.agents.unshift(agent);save(state);return json(agent,201); }
  const agentMatch=route.match(/^\/api\/voice-agents\/([^/]+)(?:\/(complete))?$/);
  if (agentMatch) {
    const agent=state.agents.find(row=>row._id===agentMatch[1]);if(!agent)return json({error:'Agent not found.'},404);
    if(method==='GET')return json(agent);
    if(agentMatch[2]==='complete'){agent.status='ready';agent.updatedAt=now();save(state);return json(agent);}
    if(method==='PATCH'||method==='PUT'){Object.assign(agent,copy(inputBody),{_id:agent._id,status:agent.status,updatedAt:now()});save(state);return json(agent);}
  }

  const recordMatch=route.match(/^\/api\/records\/([^/]+)(?:\/([^/]+))?$/);
  if (recordMatch) {
    const [,kind,recordId]=recordMatch;
    if(!recordId&&method==='GET')return json(state.records.filter(row=>row.kind===kind).slice(0,Number(queryOf(input).get('limit')||100)));
    if(!recordId&&method==='POST'){const statuses={widget:'draft',call:'waiting',campaign:'draft',callback:'requested',rating:'submitted','phone-route':'draft',agent:'draft'};const record=makeRecord(kind,String(inputBody.title||'Untitled'),statuses[kind]||'draft',inputBody.data||{});state.records.unshift(record);save(state);return json(record,201);}
    const record=state.records.find(row=>row.kind===kind&&row._id===recordId);if(!record)return json({error:'Not found.'},404);
    if(method==='GET')return json(record);
    if(method==='PATCH'||method==='PUT')return json(updateRecord(state,record,inputBody));
  }

  const workflowResult=collectionRoute(state,route,method,inputBody,'/api/workflows','workflow',value=>({draft:blankWorkflow(value.name||'Untitled workflow',state.agents.find(a=>a.status==='ready')?._id||''),versions:[],revision:1}));
  if(workflowResult)return workflowResult;
  const workflowAction=route.match(/^\/api\/workflows\/([^/]+)\/(draft|validate|simulate|publish)$/);
  if(workflowAction){const record=state.records.find(row=>row.kind==='workflow'&&row._id===workflowAction[1]);if(!record)return json({error:'Workflow not found.'},404);const action=workflowAction[2];if(action==='draft'){record.title=inputBody.draft?.name||record.title;record.data={...record.data,draft:inputBody.draft,revision:(record.data.revision||0)+1};updateRecord(state,record,{});return json(record);}if(action==='validate')return json({valid:true,issues:[],revision:record.data.revision});if(action==='simulate')return json({mode:'browser-local',steps:(record.data.draft?.nodes||[]).map(node=>({nodeId:node.id,type:node.type,title:node.config?.prompt||node.config?.message||node.type})),note:'No real call was placed.'});record.status='published';record.data.versions=[...(record.data.versions||[]),{number:(record.data.versions?.length||0)+1,publishedAt:now(),draft:copy(record.data.draft)}];record.data.revision+=1;updateRecord(state,record,{});return json(record);}

  const toolResult=collectionRoute(state,route,method,inputBody,'/api/tools','tool',value=>({type:value.type,config:{},revision:1}));if(toolResult)return toolResult;
  const toolTest=route.match(/^\/api\/tools\/([^/]+)\/test$/);if(toolTest)return json({mode:'configuration-preview',detail:'Configuration preview completed locally. No external request was sent.',executed:false});
  const teamResult=collectionRoute(state,route,method,inputBody,'/api/team','team-member',value=>({email:value.email,role:value.role,department:value.department,availability:{timezone:'Asia/Kolkata',days:['Mon','Tue','Wed','Thu','Fri'],start:'09:00',end:'18:00',paused:false},revision:1,inviteDelivered:false}));if(teamResult)return teamResult;

  const catalog=[{id:'blr-101',region:'Bengaluru',area:'080',display:'+91 80 40XX 0101'},{id:'hyd-201',region:'Hyderabad',area:'040',display:'+91 40 40XX 0201'},{id:'mum-301',region:'Mumbai',area:'022',display:'+91 22 40XX 0301'}];
  if(route==='/api/numbers/catalog')return json(catalog.map(item=>({...item,available:!state.records.some(row=>row.kind==='phone-number'&&row.data.catalogId===item.id)})));
  if(route==='/api/numbers/reserve'&&method==='POST'){const item=catalog.find(row=>row.id===inputBody.catalogId);if(!item)return json({error:'Choose a demo number.'},400);const record=makeRecord('phone-number',item.display,'reserved',{...item,catalogId:item.id,revision:1,demoOnly:true,routing:{agentId:'',timezone:'Asia/Kolkata',start:'09:00',end:'18:00',days:['Mon','Tue','Wed','Thu','Fri'],afterHours:'callback'}});state.records.unshift(record);save(state);return json(record,201);}
  const numberRouting=route.match(/^\/api\/numbers\/([^/]+)\/routing$/);if(numberRouting){const record=state.records.find(row=>row.kind==='phone-number'&&row._id===numberRouting[1]);if(!record)return json({error:'Number not found.'},404);record.data={...record.data,routing:inputBody.routing,revision:(record.data.revision||0)+1};updateRecord(state,record,{});return json(record);}
  const numbersResult=collectionRoute(state,route,method,inputBody,'/api/numbers','phone-number');if(numbersResult)return numbersResult;

  const routingResult=collectionRoute(state,route,method,inputBody,'/api/routing','inbound-route',value=>({source:value.source,numberLabel:value.numberLabel||'',numberId:value.numberId||'',revision:1,config:{agentId:'',timezone:'Asia/Kolkata',start:'09:00',end:'18:00',days:['Mon','Tue','Wed','Thu','Fri'],afterHours:'callback',maxConcurrent:5},providerConnected:false,forwardingVerified:false}));if(routingResult)return routingResult;
  const routingAction=route.match(/^\/api\/routing\/([^/]+)\/(preview|capacity|readiness)$/);if(routingAction){if(routingAction[2]==='capacity')return json({concurrent:Number(inputBody.concurrent||5),estimatedCallsPerHour:Number(inputBody.concurrent||5)*20});if(routingAction[2]==='readiness')return json({launchReady:false,checks:[{name:'Ready voice agent',passed:true},{name:'Telephony provider',passed:false}],note:'Browser-only demo route.'});return json({action:'voice-agent',reason:'Inside configured business hours',available:true});}

  if(route==='/api/widget-admin/profile'&&method==='GET')return json(state.records.find(row=>row.kind==='merchant-profile')||{title:'Sharath',status:'draft',data:{companyName:'',supportEmail:'',timezone:'Asia/Kolkata',revision:0}});
  if(route==='/api/widget-admin/profile'&&method==='PUT'){let record=state.records.find(row=>row.kind==='merchant-profile');if(!record){record=makeRecord('merchant-profile',inputBody.companyName,'draft');state.records.unshift(record);}record.title=inputBody.companyName;record.data={...inputBody,revision:(record.data?.revision||0)+1};updateRecord(state,record,{});return json(record);}
  if(route==='/api/widget-admin/widgets'&&method==='GET')return json(state.records.filter(row=>row.kind==='widget'));
  if(route==='/api/widget-admin/widgets'&&method==='POST'){const agent=state.agents.find(row=>row._id===inputBody.agentId);const record=makeRecord('widget',inputBody.name,'draft',{screen_7:{'Widget name':inputBody.name,'Voice agent':agent?.name||''},security:{agentId:inputBody.agentId,domains:[],sessionMinutes:15,revision:1}});state.records.unshift(record);save(state);return json(record,201);}
  const widgetAction=route.match(/^\/api\/widget-admin\/widgets\/([^/]+)(?:\/(domains|security|publish)(?:\/([^/]+)\/verify)?)?$/);
  if(widgetAction){const record=state.records.find(row=>row.kind==='widget'&&row._id===widgetAction[1]);if(!record)return json({error:'Widget not found.'},404);const action=widgetAction[2];if(!action)return json(record);if(action==='domains'){const origin=inputBody.origin||'https://example.com';record.data.security.domains.push({id:id(),origin,status:'verified',verifiedAt:now(),recordName:`_chatbucket.${origin.replace(/^https:\/\//,'')}`});record.data.security.revision+=1;}if(action==='security'){record.data.security.sessionMinutes=Number(inputBody.sessionMinutes)||15;record.data.security.revision+=1;}if(action==='publish')record.status='published';updateRecord(state,record,{});return json(record,action==='domains'?201:200);}

  if(route==='/api/demo/readiness')return json({mode:'browser-local',webAudio:'browser-preview',phoneCalls:'simulated',voiceAI:'keyword-preview',knowledge:'sample-FAQ',dialer:'simulated'});
  if(route==='/api/demo/voice/answer'||route==='/api/demo/widget/answer'){const question=String(inputBody.question||'');const answer=/install|widget/i.test(question)?'Copy the widget publish code into your website before the closing body tag.':'I can help with that request, or connect you with a human support agent.';return json({answer,question,demo:true});}
  if(route==='/api/demo/knowledge/index')return json({source:{status:'ready'},mode:'browser-local'});
  if(route==='/api/demo/calls/inbound'&&method==='POST'){const record=makeRecord('call',inputBody.caller||'New demo caller','waiting',{screen_14:{'Caller name':inputBody.caller||'New demo caller','Issue summary':inputBody.issue||'I need support','Department':inputBody.department||'Customer Support'},transcript:[{speaker:'Caller',text:inputBody.issue||'I need support',at:now()}],source:inputBody.channel||'web'});state.records.unshift(record);save(state);return json(record,201);}
  const campaignAction=route.match(/^\/api\/demo\/campaigns\/([^/]+)\/(eligibility|run)$/);if(campaignAction){const record=state.records.find(row=>row.kind==='campaign'&&row._id===campaignAction[1]);if(!record)return json({error:'Campaign not found.'},404);if(campaignAction[2]==='eligibility')return json({uploaded:3,eligible:3,excluded:0,duplicates:0});record.status='completed';record.data.stats={eligible:3,initiated:3,connected:2,completed:2,queued:0};updateRecord(state,record,{});return json(record);}
  if(route==='/api/demo/widget/session'&&method==='POST')return json({token:id(),expiresIn:900});
  if(route==='/api/demo/widget/calls'&&method==='POST'){const record=makeRecord('call',inputBody.caller||'Website visitor','waiting',{screen_14:{'Caller name':inputBody.caller||'Website visitor','Issue summary':inputBody.issue||'Human assistance requested'},source:'web'});state.records.unshift(record);save(state);return json(record,201);}
  const widgetCall=route.match(/^\/api\/demo\/widget\/calls\/([^/]+)$/);if(widgetCall){const record=state.records.find(row=>row.kind==='call'&&row._id===widgetCall[1]);return record?json(record):json({error:'Call not found.'},404);}
  if(route==='/api/demo/widget/feedback'&&method==='POST'){const kind=inputBody.kind==='callback'?'callback':'rating';const record=makeRecord(kind,inputBody.form?.['Your name']||'Website visitor',kind==='callback'?'requested':'submitted',{[`screen_${kind==='callback'?32:33}`]:inputBody.form||{}});state.records.unshift(record);save(state);return json(record,201);}

  return json({error:`Local demo route is not available: ${method} ${route}`},404);
}
