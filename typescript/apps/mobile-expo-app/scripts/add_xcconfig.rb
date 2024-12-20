require 'xcodeproj'

project_path = File.join(__dir__, '..', 'ios', 'DBBSExpo.xcodeproj')
config_xcconfig_path = File.join(__dir__, '..', 'ios', 'Config.xcconfig')

project = Xcodeproj::Project.open(project_path)

file_ref = project.files.find { |file| file.path == 'Config.xcconfig' }
unless file_ref
  file_ref = project.new_file(config_xcconfig_path)
end

target_group = project.main_group.find_subpath('DBBSExpo', true)
target_group.set_source_tree('SOURCE_ROOT')

if file_ref.parent != target_group
  file_ref.remove_from_project
  target_group << file_ref
end

project.build_configurations.each do |config|
  config.base_configuration_reference = file_ref
end

project.save
puts "Config.xcconfig successfully linked to all configurations!"