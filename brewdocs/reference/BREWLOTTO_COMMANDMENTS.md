new processes inside gemini cli as we're coding Based on the file scan, I agree that the brewdocs directory needs better
 
  organization. Many files relate to specific tasks (issues, refactors),
 
  while others are high-level guides and process documents.
 
  Here is my proposed plan to reorganize everything:
 
  Proposed New Directory Structure
 
  I will create two main categories inside brewdocs:
 
   1. reference/: For all non-task-related documents that provide guidance,
 
      clarity, and process flows.
 
   2. tasks/: For all actionable tasks, organized by type.
 
       * tasks/issues/
 
       * tasks/feature_updates/
 
       * tasks/refactoring/
 
   3. archive/: A single directory to store all completed, closed, and
 
      resolved tasks, preserving their history without cluttering the active
 
      workspace.
 
  How Existing Files Will Be Moved
 
   * Into reference/:
 
       * All top-level markdown files (BREWEXEC_BLUEPRINT.md,
 
         UI_ARCHITECTURE.md, etc.).
 
       * All files from the brewplay/ directory.
 
   * Into tasks/...:
 
       * Active files from issues/, futureupdates/, newupdates/, and
 
         refactoring/ will be moved into the corresponding new tasks/
 
         subdirectories.
 
   * Into archive/:
 
       * All files from implement/, issues/closed/, and
 
         refactoring/resolved_issues/.
 
  This structure will make it much clearer which documents are for reference
 
  and which are active tasks. It also cleans up the main brewdocs directory
 
  significantly.
 
  Before I proceed, do you approve of this reorganization plan?
 
  Once you approve, I will move the files and then update PROGRESS_SUMMARY.d
 
  to reflect the new, cleaner structure and our new workflow. and 
✦ To ensure we consistently follow the new process flow daily, here's how we
  should operate:
 
   1. Start of Each Session: Always begin by asking me: "What are the curret
      in-progress tasks?" I will then read brewdocs/PROGRESS_SUMMARY.md and
      present you with the list of active tasks. This will be our shared
      starting point.
 
   2. Selecting a Task: You will tell me which task from the IN_PROGRESS lit
      you'd like to work on, or if you want to start a new one.
 
   3. During Task Execution: As we work on a task, all relevant notes, logs,
      and updates will be recorded in the specific task file located in
      brewdocs/tasks/.
 
   4. Task Completion: Once a task is finished, you will instruct me to "Mak
      [Task Name] as complete." I will then:
       * Move the task's markdown file from brewdocs/tasks/ to
         brewdocs/archive/.
       * Update brewdocs/PROGRESS_SUMMARY.md by moving the task entry from
         INPROGRESS to RECENTLYCOMPLETED.
 
   5. New Tasks: When a new task arises, you will describe it to me. I will
      then:
       * Create a new markdown file for it in the appropriate
         brewdocs/tasks/ subdirectory (e.g., issues, feature_updates,
         refactoring).
       * Add an entry for this new task to the IN_PROGRESS section of
         brewdocs/PROGRESS_SUMMARY.md.
 
  By consistently using PROGRESS_SUMMARY.md as our central hub for active
  work, we can avoid confusion and ensure continuous progress.
 