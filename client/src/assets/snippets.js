export const SNIPPETS = {
    HTML: {
        layout: {
            label: 'Layout',
            hint: 'Tags that build the page',
            items: [
                '<header class="top">', '<main id="app">', '<section class="hero">', '<nav class="menu">',
                '<footer class="site">', '<article class="post">', '<aside class="side">', '<div class="card">',
            ],
        },
        text: {
            label: 'Text',
            hint: 'Headings, lists and words',
            items: [
                '<h1>Hello World</h1>', '<p class="lead">', '<strong>Important</strong>', '<em>note</em>',
                '<span class="badge">', '<ul class="list">', '<li>First item</li>', '<blockquote>',
            ],
        },
        forms: {
            label: 'Forms',
            hint: 'Inputs and buttons',
            items: [
                '<form action="/login">', '<input type="email" />', '<label for="name">', '<button type="submit">',
                '<select name="lang">', '<option value="js">', '<textarea rows="4">', '<input type="checkbox" />',
            ],
        },
        media: {
            label: 'Links & media',
            hint: 'Links, images and video',
            items: [
                '<a href="/about">', '<img src="logo.png" />', '<video controls>', '<audio src="hit.mp3">',
                '<link rel="stylesheet">', '<canvas id="stage">', '<iframe src="map.html">', '<source type="video/mp4">',
            ],
        },
    },
    CSS: {
        selectors: {
            label: 'Selectors',
            hint: 'Picking what to style',
            items: [
                '.card:hover {', '#app > main {', 'ul li:first-child {', 'a[href^="https"] {',
                'input:focus {', '.btn::after {', 'nav a.active {', ':root {',
            ],
        },
        box: {
            label: 'Box & spacing',
            hint: 'Size, margin and padding',
            items: [
                'margin: 0 auto;', 'padding: 16px 24px;', 'border-radius: 8px;', 'width: 100%;',
                'max-width: 960px;', 'border: 1px solid #333;', 'box-sizing: border-box;', 'height: 100vh;',
            ],
        },
        layout: {
            label: 'Flex & grid',
            hint: 'Lining things up',
            items: [
                'display: flex;', 'justify-content: center;', 'align-items: center;', 'gap: 1rem;',
                'display: grid;', 'grid-template-columns: 1fr 1fr;', 'flex-direction: column;', 'flex-wrap: wrap;',
            ],
        },
        effects: {
            label: 'Color & motion',
            hint: 'Colors, shadows and animation',
            items: [
                'color: #00e572;', 'background: #0b0f18;', 'opacity: 0.5;', 'transition: all 0.3s ease;',
                'transform: scale(1.1);', 'animation: spin 1s linear;', 'box-shadow: 0 4px 12px #0003;', 'font-weight: 700;',
            ],
        },
    },
    JAVASCRIPT: {
        variables: {
            label: 'Variables',
            hint: 'Storing values',
            items: [
                'let score = 0;', 'const name = "Ada";', 'let isReady = false;', 'let level = 1;',
                'const PI = 3.14;', 'let total = a + b;', 'let count = items.length;', 'var old = true;',
            ],
        },
        functions: {
            label: 'Functions',
            hint: 'Making and calling functions',
            items: [
                'function add(a, b) {', 'const double = x => x * 2;', 'return a + b;', 'async function load() {',
                'console.log(score);', 'greet("World");', 'setTimeout(tick, 1000);', 'arr.map(x => x * 2)',
            ],
        },
        logic: {
            label: 'Logic',
            hint: 'If, loops and errors',
            items: [
                'if (score > 10) {', '} else {', 'for (let i = 0; i < 5; i++) {', 'while (lives > 0) {',
                'switch (key) {', 'case "Enter":', 'try { run(); }', 'return x ? 1 : 0;',
            ],
        },
        data: {
            label: 'Data',
            hint: 'Arrays and objects',
            items: [
                'const nums = [1, 2, 3];', 'const user = { id: 1 };', 'arr.push(item);', 'obj.name = "Ada";',
                'const [a, b] = pair;', 'const { id } = user;', 'Object.keys(obj)', 'JSON.parse(text)',
            ],
        },
    },
    TYPESCRIPT: {
        variables: {
            label: 'Variables',
            hint: 'Values with types',
            items: [
                'let age: number = 21;', 'const name: string = "";', 'let ok: boolean = true;', 'const ids: number[] = [];',
                'let id: string | null;', 'const max = 10 as const;', 'let data: unknown;',
            ],
        },
        functions: {
            label: 'Functions',
            hint: 'Typed inputs and outputs',
            items: [
                'function sum(a: number) {', 'const fn = (x: string) =>', 'function log(msg: string): void',
                'function id<T>(x: T): T {', 'return value as string;', 'async function get(): Promise', 'const cb: () => void',
            ],
        },
        types: {
            label: 'Types',
            hint: 'Describing shapes of data',
            items: [
                'interface User {', 'type Id = string | number;', 'Partial<User>', 'Record<string, number>',
                'enum Status { On, Off }', 'type Props = { title: string }', 'keyof User',
            ],
        },
        classes: {
            label: 'Classes',
            hint: 'Blueprints for objects',
            items: [
                'class Player {', 'private hp: number;', 'constructor(public name: string)', 'readonly id: string;',
                'implements Shape {', 'extends Base {', 'static count = 0;',
            ],
        },
    },
    PYTHON: {
        variables: {
            label: 'Variables',
            hint: 'Storing values',
            items: [
                'name = "Ada"', 'score = 0', 'is_ready = False', 'total = a + b',
                'PI = 3.14', 'x, y = 10, 20', 'count += 1', 'level = None',
            ],
        },
        functions: {
            label: 'Functions',
            hint: 'Making and calling functions',
            items: [
                'def add(a, b):', 'return a + b', 'print(score)', 'def __init__(self):',
                'lambda x: x * 2', 'greet("World")', 'async def fetch():', 'len(items)',
            ],
        },
        logic: {
            label: 'Logic',
            hint: 'If, loops and errors',
            items: [
                'if score > 10:', 'elif score > 5:', 'for i in range(5):', 'while lives > 0:',
                'except ValueError:', 'if not items:', 'for k, v in d.items():', 'raise KeyError(key)',
            ],
        },
        data: {
            label: 'Data',
            hint: 'Lists, dicts and sets',
            items: [
                'nums = [1, 2, 3]', 'user = {"id": 1}', 'items.append(x)', 'point = (3, 4)',
                'tags = {"a", "b"}', 'squares = [x * x for x in nums]', 'user["name"]', 'nums.sort()',
            ],
        },
    },
    'SQL & RUST': {
        variables: {
            label: 'Rust variables',
            hint: 'let, mut and const',
            items: [
                'let x = 5;', 'let mut count = 0;', 'let name = "Ada";', 'const MAX: u32 = 100;',
                'let v: Vec<i32> = vec![];', 'let (a, b) = (1, 2);', 'let s = String::new();',
            ],
        },
        functions: {
            label: 'Rust functions',
            hint: 'fn, impl and macros',
            items: [
                'fn main() {', 'fn add(a: i32, b: i32) -> i32', 'println!("{}", x);', 'pub fn new() -> Self {',
                'return Ok(());', 'x.unwrap_or(0)', 'impl Player {',
            ],
        },
        logic: {
            label: 'SQL queries',
            hint: 'Reading data from tables',
            items: [
                'SELECT * FROM users;', 'SELECT name FROM players', 'WHERE score > 100', 'ORDER BY score DESC',
                'LIMIT 10;', 'JOIN orders ON u.id = o.uid', 'GROUP BY level;',
            ],
        },
        data: {
            label: 'SQL changes',
            hint: 'Adding and changing rows',
            items: [
                'INSERT INTO users (name)', "VALUES ('Ada');", 'UPDATE users SET level = 2', 'DELETE FROM sessions;',
                'CREATE TABLE scores (', 'id INT PRIMARY KEY,', 'ALTER TABLE users ADD age INT;',
            ],
        },
    },
    GO: {
        variables: {
            label: 'Variables',
            hint: 'var, := and const',
            items: [
                'x := 10', 'var name string', 'count := 0', 'var ok bool = true',
                'const Max = 100', 'a, b := 1, 2', 'var mu sync.Mutex',
            ],
        },
        functions: {
            label: 'Functions',
            hint: 'func, go and defer',
            items: [
                'func main() {', 'func add(a, b int) int {', 'return a + b', 'fmt.Println("hi")',
                'go worker(ch)', 'defer file.Close()', 'func (p *Player) Hit() {',
            ],
        },
        logic: {
            label: 'Logic',
            hint: 'if, for and switch',
            items: [
                'if err != nil {', 'for i := 0; i < 5; i++ {', 'for _, v := range list {', 'switch day {',
                'case "mon":', 'select {', 'return nil, err',
            ],
        },
        data: {
            label: 'Data',
            hint: 'Slices, maps and structs',
            items: [
                'nums := []int{1, 2, 3}', 'm := map[string]int{}', 'type User struct {', 'Name string',
                'ch := make(chan int)', 'list = append(list, x)', 'len(nums)',
            ],
        },
    },
    'C++': {
        variables: {
            label: 'Variables',
            hint: 'Typed values',
            items: [
                'int score = 0;', 'double pi = 3.14;', 'bool ready = false;', 'auto name = "Ada";',
                'const int MAX = 100;', 'std::string s = "hi";', "char grade = 'A';",
            ],
        },
        functions: {
            label: 'Functions',
            hint: 'Making and calling functions',
            items: [
                'int add(int a, int b) {', 'return a + b;', 'void greet() {', 'std::cout << "hi";',
                'auto f = [](int x) {', 'int main() {', 'template <typename T>',
            ],
        },
        logic: {
            label: 'Logic',
            hint: 'if, loops and switch',
            items: [
                'if (x > 0) {', '} else {', 'for (int i = 0; i < n; i++)', 'while (lives > 0) {',
                'switch (key) {', 'case 1: break;', 'try { run(); }',
            ],
        },
        data: {
            label: 'Data',
            hint: 'Arrays, vectors and structs',
            items: [
                'std::vector<int> v;', 'v.push_back(42);', 'int arr[5] = {0};', 'struct Point {',
                'std::map<std::string, int> m;', 'class Player {', 'int* p = &x;',
            ],
        },
    },
    REGEX: {
        anchors: {
            label: 'Anchors',
            hint: 'Start, end and word edges',
            items: ['^hello', 'world$', '^\\d+$', '\\bcat\\b', '^[A-Z]', '\\.com$', '^\\s*$'],
        },
        classes: {
            label: 'Character sets',
            hint: 'Which letters can match',
            items: ['[a-z]+', '[A-Za-z0-9]', '\\d{3}', '\\w+', '[^aeiou]', '\\s+', '[0-9a-f]{6}'],
        },
        groups: {
            label: 'Groups',
            hint: 'Capturing parts of a match',
            items: ['(\\d{3})-(\\d{4})', '(?:cat|dog)', '(?<year>\\d{4})', '(\\w+)\\s\\1', '(ab)+', '(https?)://', '(a|b|c)'],
        },
        look: {
            label: 'Lookarounds',
            hint: 'Checking what is next to it',
            items: ['(?=.*\\d)', '(?!test)', '(?<=\\$)\\d+', '(?<!no)pe', '\\w+(?=\\()', '^(?=.*[A-Z]).{8,}$', '(?<=#)\\w+'],
        },
    },
};

export const LANGUAGES = Object.keys(SNIPPETS);

const SHARED = {
    variables: { label: 'Variables', hint: 'Storing values' },
    functions: { label: 'Functions', hint: 'Making and calling functions' },
    logic: { label: 'Logic', hint: 'If, loops and errors' },
    data: { label: 'Data', hint: 'Lists, objects and tables' },
};

export function categoriesFor(mode) {
    if (mode === 'RANDOM') return Object.entries(SHARED).map(([key, info]) => ({ key, ...info }));
    const bank = SNIPPETS[mode] || SNIPPETS.HTML;
    return Object.entries(bank).map(([key, { label, hint }]) => ({ key, label, hint }));
}

export function roundPlan(mode, category) {
    const all = categoriesFor(mode);
    if (category && category !== 'mixed') {
        const one = all.find((c) => c.key === category);
        if (one) return [one];
    }
    return all;
}

const pick = (list) => list[Math.floor(Math.random() * list.length)];

export function pickSnippet(mode, category) {
    let lang = mode;
    if (mode === 'RANDOM') {
        const pool = LANGUAGES.filter((l) => !category || SNIPPETS[l][category]);
        lang = pick(pool.length ? pool : LANGUAGES);
    }
    const bank = SNIPPETS[lang] || SNIPPETS.HTML;
    const group = bank[category] || bank[pick(Object.keys(bank))];
    return { snippet: pick(group.items), lang };
}
