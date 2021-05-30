import { Registry } from "../CommandHandler";

export default Registry.Command({
    id: "Foo",
    group: Registry.Groups.Fun,
    run: function (): void {
        console.log(this);
    }
});