const supabase = require("./config/supabase");

async function test() {
    const { data, error } = await supabase
        .from("bulls")
        .select("*");

    if (error) {
        console.error(error);
    } else {
        console.log(data);
    }
}

test();