-- This is an empty migration.
-- Enable RLS
ALTER TABLE "Book" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Clipping" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Reflection" ENABLE ROW LEVEL SECURITY;

-- SELECT (read)
CREATE POLICY select_books ON "Book"
  FOR SELECT
  USING (("userId") = current_setting('app.current_user_id'));

CREATE POLICY select_clippings ON "Clipping"
  FOR SELECT
  USING (("userId") = current_setting('app.current_user_id'));

CREATE POLICY select_reflections ON "Reflection"
  FOR SELECT
  USING (("userId") = current_setting('app.current_user_id'));

-- UPDATE (edit)
CREATE POLICY update_books ON "Book"
  FOR UPDATE
  USING (("userId") = current_setting('app.current_user_id'));

CREATE POLICY update_clippings ON "Clipping"
  FOR UPDATE
  USING (("userId") = current_setting('app.current_user_id'));

CREATE POLICY update_reflections ON "Reflection"
  FOR UPDATE
  USING (("userId") = current_setting('app.current_user_id'));

-- DELETE (delete)
CREATE POLICY delete_books ON "Book"
  FOR DELETE
  USING (("userId") = current_setting('app.current_user_id'));

CREATE POLICY delete_clippings ON "Clipping"
  FOR DELETE
  USING (("userId") = current_setting('app.current_user_id'));

CREATE POLICY delete_reflections ON "Reflection"
  FOR DELETE
  USING (("userId") = current_setting('app.current_user_id'));

-- INSERT (create)
CREATE POLICY insert_books ON "Book"
  FOR INSERT
  WITH CHECK (("userId") = current_setting('app.current_user_id'));

CREATE POLICY insert_clippings ON "Clipping"
  FOR INSERT
  WITH CHECK (("userId") = current_setting('app.current_user_id'));

CREATE POLICY insert_reflections ON "Reflection"
  FOR INSERT
  WITH CHECK (("userId") = current_setting('app.current_user_id'));

