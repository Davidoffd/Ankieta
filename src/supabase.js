import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  "https://puhnvjsxbcealvaxksid.supabase.co";

const supabaseKey =
  "sb_publishable_dMHVmtgPnVMRtV0tmsTJPw_WL4-abpw";

export const supabase =
  createClient(
    supabaseUrl,
    supabaseKey
  );