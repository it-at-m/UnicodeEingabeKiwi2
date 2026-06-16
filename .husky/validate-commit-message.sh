# Shared commit message validation for Husky hooks.
# Usage: . "$(dirname "$0")/validate-commit-message.sh"
#        validate_commit_message "feat(KIWI): summary"

validate_commit_message() {
  commit_msg=$1

  RED='\033[0;31m'
  GREEN='\033[0;32m'
  NC='\033[0m'

  if [ -f .git/MERGE_HEAD ] || echo "$commit_msg" | grep -qE '^Merge '; then
    printf "${GREEN}✓ Merge commit message accepted.${NC}\n"
    return 0
  fi

  valid_types="feat|fix|clean|chore|docs"
  valid_projects="KIWI|GH"
  pattern="^($valid_types)\(($valid_projects)(-[0-9]+)?\): .+"

  if echo "$commit_msg" | grep -qE "$pattern"; then
    printf "${GREEN}✓ Commit message format is valid.${NC}\n"
    return 0
  fi

  printf "${RED}✗ Invalid commit message format!${NC}\n"
  echo ""
  echo "Commit messages must follow the conventional commits format:"
  echo "  type(PROJECT-123): commit message"
  echo "  type(PROJECT): commit message"
  echo ""
  echo "Valid types: feat, fix, clean, chore, docs"
  echo "Valid projects: KIWI, GH (must be uppercase)"
  echo "Ticket number is optional (e.g., KIWI-123 or just KIWI)"
  echo ""
  echo "Examples:"
  echo "  feat(KIWI): add keyboard layout preset"
  echo "  fix(KIWI-42): correct diacritic search"
  echo "  chore(GH): bump dependencies"
  echo "  docs(KIWI): update README"
  echo ""
  echo "For more information, see:"
  echo "  .husky/README.md"
  echo "  https://www.conventionalcommits.org/en/v1.0.0/"
  echo ""
  echo "Your commit message:"
  echo "  $commit_msg"
  return 1
}
