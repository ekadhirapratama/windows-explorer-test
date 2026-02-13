<template>
  <aside class="sidebar custom-scrollbar">
    <div class="sidebar-content">
      <!-- This PC (slot for FolderTree) -->
      <div>
        <slot name="this-pc">
          <!-- Default: let parent provide FolderTree via slot -->
        </slot>
      </div>

    </div>
  </aside>
</template>