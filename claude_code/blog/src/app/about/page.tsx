import { User } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">关于</h1>

      <section className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
            <User className="h-10 w-10 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">清风逸</h2>
            <p className="text-muted-foreground">Java 程序员 / AI 学习者</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">个人简介</h2>
        <div className="text-muted-foreground space-y-3 leading-relaxed">
          <p>
            你好！我是清风逸，一名热爱技术的 Java 程序员。目前正在学习和探索 AI
            领域的相关知识，包括机器学习、自然语言处理等方向。
          </p>
          <p>
            这个博客是我记录学习心得、分享技术见解的空间。我会在这里分享关于
            Java、后端开发、前端技术、以及 AI 相关的学习和思考。
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">技术栈</h2>
        <div className="flex flex-wrap gap-2">
          {["Java", "Spring Boot", "Next.js", "TypeScript", "React", "Machine Learning"].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full bg-secondary text-sm text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">联系方式</h2>
        <div className="text-muted-foreground space-y-2">
          <p>GitHub: github.com/qingfengyi</p>
          <p>Email: hello@qingfengyi.com</p>
        </div>
      </section>
    </div>
  );
}
