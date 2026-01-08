import { iconMap } from "@/constants/stays/icon-map";
import React, { useState } from "react";
import { Collapse, Input, Button } from "antd";
import {
  CloseOutlined,
  MinusOutlined,
  PlusOutlined,
  SearchOutlined,
  DownOutlined,
  UpOutlined,
} from "@ant-design/icons";

const FeatureDetails = ({ features }: { features: any }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activePanels, setActivePanels] = useState<string[]>(
    features?.slice(0, 2).map((f: any) => f.id) || []
  );

  // Filter features based on search term
  // API returns: feature.heading for main feature name, and sub_feature.name for sub-feature names
  const filteredFeatures = features?.filter((feature: any) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    const featureName = feature?.heading || feature?.name || "";
    const matchesHeading = featureName.toLowerCase().includes(searchLower);
    const matchesSubFeatures = feature?.sub_features?.some((item: any) => {
      const subName = item?.name || item?.sub_heading || "";
      return subName.toLowerCase().includes(searchLower);
    });
    return matchesHeading || matchesSubFeatures;
  });

  const handleExpandAll = () => {
    setActivePanels(filteredFeatures?.map((f: any) => f.id) || []);
  };

  const handleCollapseAll = () => {
    setActivePanels([]);
  };

  const handlePanelChange = (keys: string | string[]) => {
    setActivePanels(Array.isArray(keys) ? keys : [keys]);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-primary mt-6 mb-4">Features</h2>
      
      {/* Screen version with collapsible panels */}
      <div className="screen-only">
        {/* Search Bar */}
        <div className="mb-4">
          <Input
            placeholder="Search amenities..."
            prefix={<SearchOutlined className="text-gray-400" />}
            suffix={
              searchTerm && (
                <CloseOutlined
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                  onClick={() => setSearchTerm("")}
                />
              )
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="py-2 rounded-lg"
            allowClear={false}
          />
        </div>

        {/* Collapsible Sections */}
        {filteredFeatures?.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No amenities match your search</p>
            <button
              className="mt-2 text-primary hover:underline"
              onClick={() => setSearchTerm("")}
            >
              Clear search
            </button>
          </div>
        ) : (
          <Collapse
            bordered={false}
            expandIcon={({ isActive }) =>
              isActive ? <MinusOutlined /> : <PlusOutlined />
            }
            className="bg-gray-50"
            activeKey={activePanels}
            onChange={handlePanelChange}
          >
            {filteredFeatures?.map((feature: any) => {
              const featureName = feature?.heading || feature?.name || "Feature";
              return (
                <Collapse.Panel
                  key={feature?.id}
                  header={
                    <div className="flex items-center">
                      <div className="text-primary text-xl mr-3">
                        {iconMap(featureName)}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {featureName}
                      </h3>
                      <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {feature?.sub_features?.length || 0}
                      </span>
                    </div>
                  }
                  className="mb-4 bg-white rounded-lg shadow-sm border border-gray-200"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {feature?.sub_features?.map((item: any) => {
                      const subFeatureName =
                        item?.name || item?.sub_heading || "Sub-feature";
                      return (
                        <div
                          key={item?.id}
                          className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <div className="text-primary text-xl">
                            {iconMap(subFeatureName)}
                          </div>
                          <span className="text-base">{subFeatureName}</span>
                        </div>
                      );
                    })}
                  </div>
                </Collapse.Panel>
              );
            })}
          </Collapse>
        )}
      </div>

      {/* Print version - simple list without icons */}
      <div className="print-only">
        {features?.map((feature: any) => {
          const featureName = feature?.heading || feature?.name || "Feature";
          return (
            <div key={feature?.id} className="mb-4">
              <h3 className="text-base font-semibold text-gray-800 mb-2">
                {featureName} ({feature?.sub_features?.length || 0})
              </h3>
              <div className="grid grid-cols-3 gap-x-4 gap-y-1 text-sm pl-4">
                {feature?.sub_features?.map((item: any) => {
                  const subFeatureName = item?.name || item?.sub_heading || "Sub-feature";
                  return (
                    <div key={item?.id} className="text-gray-700">
                      • {subFeatureName}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeatureDetails;
