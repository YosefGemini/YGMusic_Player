#!/usr/bin/env bash
# Source this before running native Android builds:
#   source scripts/android-env.sh
#
# Why: the system default JDK (26/27) is newer than what React Native's Gradle
# toolchain supports, and ANDROID_HOME is not set globally on this machine.
# A local Temurin JDK 17 lives under ~/.local/opt (installed in Phase 0).

export ANDROID_HOME="${ANDROID_HOME:-$HOME/Android/Sdk}"
export ANDROID_SDK_ROOT="$ANDROID_HOME"

JDK17_DIR="$(ls -d "$HOME"/.local/opt/jdk-17* 2>/dev/null | head -n 1)"
if [ -n "$JDK17_DIR" ]; then
  export JAVA_HOME="$JDK17_DIR"
fi

export PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH"

echo "ANDROID_HOME=$ANDROID_HOME"
echo "JAVA_HOME=$JAVA_HOME"
java -version 2>&1 | head -n 1
